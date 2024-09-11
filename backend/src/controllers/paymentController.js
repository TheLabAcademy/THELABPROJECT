/* eslint-disable consistent-return */
/* eslint-disable object-shorthand */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const tables = require("../tables");
const stock_event = require("./StockEventController");

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

const applyPromotionCode = async (promoCode) => {
  // Utilisation code promo stripe fonctionnelle
  // if (promoCode) {
  //   const promotionCodes = await stripe.promotionCodes.list();
  //   const promotionCode = promotionCodes.data.find(
  //     (p) => p.code === promoCode
  //   );

  //   if (promotionCode) {
  //     if (promotionCode.coupon.amount_off) {
  //       promotionAmountOff = promotionCode.coupon.amount_off;
  //     } else if (promotionCode.coupon.percent_off) {
  //       promotionPercentageOff = promotionCode.coupon.percent_off;
  //     }
  //   } else {
  //     throw new Error("Code promo invalide.");
  //   }
  // }

  // Récupérer tous les codes promotionnels avec le même code
  const discounts = await tables.discount.getDiscountAll();

  // Filtrer pour obtenir tous les codes ayant le même nom de code promo
  const promotionCodes = discounts.filter((d) => d.promo_code === promoCode);

  if (promotionCodes.length === 0) {
    throw new Error("Code promo introuvable.");
  }

  // Créer un tableau de promesses pour vérifier chaque code promo
  const validCodesPromises = promotionCodes.map(async (promotionCode) => {
    // Vérifier si le code promo est actif
    if (promotionCode.status === 1) {
      const currentDate = new Date();
      const validityDate = new Date(promotionCode.duree_de_validite);

      // Vérifier la validité de la date et la quantité restante
      if (currentDate <= validityDate && promotionCode.quantity > 0) {
        // Retourner les informations du code promo valide
        return promotionCode;
      }
    }
    return null; // Retourner null si le code promo n'est pas valide
  });

  // Attendre que toutes les vérifications soient terminées
  const validCodes = await Promise.all(validCodesPromises);

  // Filtrer les codes valides non-nuls
  const validPromotionCodes = validCodes.filter((code) => code !== null);

  if (validPromotionCodes.length === 0) {
    throw new Error("Aucun code promo valide trouvé.");
  }

  // Sélectionner le meilleur code promo en fonction du pourcentage de réduction ou d'une autre logique
  const bestPromotionCode = validPromotionCodes.reduce(
    (bestCode, currentCode) => {
      // Comparer par le pourcentage de réduction
      if (currentCode.percent_value > (bestCode?.percent_value || 0)) {
        return currentCode;
      }
      return bestCode;
    },
    null
  );

  // Décrémenter la quantité du meilleur code promo

  return bestPromotionCode;
};

// Fonction séparée pour finaliser le paiement et enregistrer dans la base de données
const finalizePayment = async (userId, paymentIntent, promotionCode) => {
  const paymentMethodUsed = paymentIntent.payment_method;
  const amountPaid = paymentIntent.amount_received || paymentIntent.amount;

  await tables.payment.queryAddPayment({
    amount: amountPaid,
    payment_method: paymentMethodUsed,
    discount_id: promotionCode ? promotionCode.id : null,
    user_id: userId,
  });

  // Décrémenter la quantité du meilleur code promo
  if (promotionCode) {
    const updateFields = {
      quantity: promotionCode.quantity - 1,
      duree_de_validite: promotionCode.duree_de_validite,
    };
    await tables.discount.updateDiscount(promotionCode.id, updateFields);
  }
};

const addPayment = async (req, res, next) => {
  try {
    const { stripeCustomerId, priceId, promoCode, paymentMethodId, email } =
      req.body;
    const userId = req.payload; // ID de l'utilisateur

    // Vérification des paramètres essentiels
    if (!priceId || !paymentMethodId || !email) {
      return res
        .status(400)
        .json({ error: "Des informations sont manquantes" });
    }

    // Récupérer ou créer le client Stripe
    let customerId = stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email });
      customerId = customer.id;
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
    const promotionCode = promoCode
      ? await applyPromotionCode(promoCode)
      : null;

    if (promotionCode) {
      if (promotionCode.percent_value) {
        finalAmount = Math.max(
          finalAmount - finalAmount * (promotionCode.percent_value / 100),
          0
        );
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
          discount_id: promotionCode ? promotionCode.id : null,
          status: "requires_action",
          priceId: price.id,
        },
      });
    }
    if (paymentIntent.status === "succeeded") {
      // Ajouter l'enregistrement de paiement et mise à jour du code promo si applicable
      await finalizePayment(userId, paymentIntent, promotionCode);
      await stock_event.createStockEvent(req, res);
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
    const id = req.payload;
    const { paymentIntentId, discount_id } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      await finalizePayment(id, paymentIntent, discount_id);
      await tables.payment.queryAddPayment({
        amount: paymentIntent.amount_received,
        payment_method: paymentIntent.payment_method,
        discount_id: discount_id || null,
        user_id: id,
      });

      await stock_event.createStockEvent(req, res);
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
