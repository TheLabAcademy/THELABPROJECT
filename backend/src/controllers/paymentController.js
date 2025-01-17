/* eslint-disable consistent-return */
/* eslint-disable object-shorthand */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const tables = require("../tables");
const stock_event = require("./StockEventController");
const userDiscountController = require("./userDiscountController");

const getPayment = async (req, res, next) => {
  try {
    const id = req.payload;
    const [admin] = await tables.user.getUserById(id);
    if (admin[0].is_admin !== "admin" && admin[0].is_admin !== "superAdmin") {
      return res.status(401).json({ error: "Vous n'avez pas les droits" });
    }
    const payment = await tables.payment.readAll();
    res.json(payment);
  } catch (err) {
    next(err);
  }
};

// Fonction séparée pour finaliser le paiement et enregistrer dans la base de données
const finalizePayment = async (userId, paymentIntent, promotionCodeId) => {
  const paymentMethodUsed = paymentIntent.payment_method;
  const amountPaid = paymentIntent.amount_received || paymentIntent.amount;
  await tables.payment.queryAddPayment({
    amount: amountPaid,
    payment_method: paymentMethodUsed,
    discount_id: promotionCodeId || null,
    user_id: userId,
  });

  const promotionCode = await tables.discount.getDiscountById(promotionCodeId);
  // Décrémenter la quantité du meilleur code promo
  if (promotionCode && promotionCode.length > 0) {
    const updateFields = {
      quantity: promotionCode[0].quantity - 1,
      duree_de_validite: promotionCode[0].duree_de_validite,
    };
    await tables.discount.updateDiscount(promotionCode.id, updateFields);
  }

  // Vérifier et récupérer l'ID de la dernière charge
  if (paymentIntent.latest_charge) {
    // Récupérer la charge associée
    const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);

    // Vérifier que le lien du reçu existe
    if (charge && charge.receipt_url) {
      return charge;
    }
    return null; // Aucun reçu disponible
  }
  return null; // Aucun ID de charge disponible
};

const addPayment = async (req, res, next) => {
  try {
    const {
      stripeCustomerId,
      priceId,
      promoCode,
      paymentMethodId,
      email,
      event_id,
    } = req.body;
    const userId = req.payload; // ID de l'utilisateur

    // Vérification des paramètres essentiels
    if (!priceId || !paymentMethodId || !email) {
      return res
        .status(400)
        .json({ error: "Des informations sont manquantes" });
    }

    // Vérifier si l'utilisateur est déjà inscrit à l'événement
    const [checkUserInEvent] = await tables.stock_event.checkUserEvent(
      event_id,
      userId
    );
    if (checkUserInEvent.length > 0) {
      return res
        .status(400)
        .json({ error: "Vous êtes déjà inscrit à cet événement." });
    }

    // Récupérer ou créer le client Stripe
    let customerId = stripeCustomerId;

    if (!customerId) {
      // Rechercher un client existant dans Stripe par email
      const existingCustomers = await stripe.customers.list({
        email: email,
        limit: 1, // On limite à un seul résultat
      });

      if (existingCustomers.data.length > 0) {
        // Si un client existe déjà, récupérer son ID
        customerId = existingCustomers.data[0].id;
      } else {
        // Sinon, créer un nouveau client
        const customer = await stripe.customers.create({
          email,
          preferred_locales: ["fr"], // Définit la langue préférée en français
        });
        customerId = customer.id;
      }
    }

    // Attacher la méthode de paiement si nécessaire
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // Récupérer les informations de prix et de produit
    const price = await stripe.prices.retrieve(priceId);
    if (!price) return res.status(404).json({ error: "Prix introuvable" });

    const product = await stripe.products.retrieve(price.product);
    if (!product) return res.status(404).json({ error: "Produit introuvable" });

    // Vérifier le code promo (logique déplacée dans une fonction séparée)
    let finalAmount = price.unit_amount;
    let promotionCode = null;

    // Vérification du code promo avec await et gestion des erreurs
    if (promoCode) {
      const promoResponse = await userDiscountController.checkDiscount(
        req,
        res
      ); // Assure-toi que cette fonction est async et retourne la réponse

      if (promoResponse.success && promoResponse.bestPromotionCode) {
        promotionCode = promoResponse.bestPromotionCode;
        if (promotionCode.percent_value) {
          finalAmount = Math.max(
            finalAmount - finalAmount * (promotionCode.percent_value / 100),
            0
          );
        }
      } else {
        return res.status(400).json({
          success: false,
          message: promoResponse.message || "Code promo invalide",
        });
      }
    }

    // Créer le PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: price.currency,
      customer: customerId,
      receipt_email: email,
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
      metadata: {
        product_name: product.name,
        product_id: product.id,
        price_id: price.id,
        original_amount: price.unit_amount, // Montant initial sans réduction
        discount_applied: promotionCode ? promotionCode.percent_value || 0 : 0, // Pourcentage de réduction appliqué, si applicable
        promotion_id: promotionCode ? promotionCode.id : "none", // ID de la promotion appliquée, ou "none" si aucune
      },
    });

    // Vérifier le statut du paiement
    if (
      paymentIntent.status === "requires_action" ||
      paymentIntent.status === "requires_payment_method"
    ) {
      return res.json({
        data: {
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
          discount_id: promotionCode.id || null,
          status: "requires_action",
          priceId: price.id,
        },
      });
    }
    if (paymentIntent.status === "succeeded") {
      // Ajouter l'enregistrement de paiement et mise à jour du code promo si applicable
      const charge = await finalizePayment(
        userId,
        paymentIntent,
        promotionCode ? promotionCode.id : null
      );
      await stock_event.createStockEvent(req, res, charge);
      return;
    }

    return res.status(400).json({ error: "Échec du paiement" });
  } catch (err) {
    console.error("Erreur lors du traitement du paiement :", err);
    return next(err);
  }
};

// Fonction séparée pour appliquer et vérifier le code promotionnel

const updatePayment = async (req, res) => {
  try {
    const { bill_number } = req.params;
    const [result] = await tables.payment.updatePayment(bill_number, req.body);
    if (result.affectedRows) {
      res.status(200).json({ message: "Payment mis à jour" });
    } else {
      res.status(401).send("probleme");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const deletePayment = async (req, res) => {
  const { id } = req.params;
  try {
    await tables.payment.deletePayment({ bill_number: id });
    res.json({ message: "Payment a bien été supprimer" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkPayment = async (req, res) => {
  try {
    const userId = req.payload;
    const { paymentIntentId, discount_id } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status === "succeeded") {
      const charge = await finalizePayment(userId, paymentIntent, discount_id);
      await stock_event.createStockEvent(req, res, charge);
    } else res.json({ error: "Payment échoué" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPayment,
  addPayment,
  updatePayment,
  deletePayment,
  checkPayment,
};
