/* eslint-disable consistent-return */
/* eslint-disable object-shorthand */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const tables = require("../tables");

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

const addPayment = async (req, res, next) => {
  try {
    const id = req.payload; // ID de l'utilisateur
    const { stripeCustomerId, priceId, promoCode, paymentMethodId, email } =
      req.body;

    let customerId = stripeCustomerId;

    // Créer un client Stripe si non fourni
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: email,
      });
      customerId = customer.id;
    }

    // Vérification si une méthode de paiement est fournie
    if (!paymentMethodId) {
      throw new Error("Aucune méthode de paiement fournie.");
    }

    // Attacher la méthode de paiement au client
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Récupérer directement le prix à partir de priceId
    const price = await stripe.prices.retrieve(priceId);

    if (!price) {
      throw new Error("Prix introuvable pour cet identifiant.");
    }

    // Créer un paiement unique pour le produit avec le priceId
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price.unit_amount, // Montant à payer en centimes
      currency: price.currency, // Devise associée au prix
      customer: customerId,
      payment_method: paymentMethodId, // Utiliser la méthode de paiement fournie
      confirm: true,
      automatic_payment_methods: {
        enabled: true, // Active les méthodes automatiques
        allow_redirects: "never", // Désactive les méthodes nécessitant des redirections
      },
      ...(promoCode && { discount: { promotion_code: promoCode } }), // Optionnellement ajouter un code promo
    });

    // Vérifier le statut du paiement
    if (
      paymentIntent.status === "requires_action" ||
      paymentIntent.status === "requires_payment_method"
    ) {
      res.json({
        data: {
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
          status: "requires_action",
          priceId: price.id, // ID du prix utilisé
        },
      });
    } else if (paymentIntent.status === "succeeded") {
      // Récupérer la méthode de paiement utilisée
      const paymentMethodUsed = paymentIntent.payment_method;

      if (!paymentMethodUsed) {
        throw new Error("La méthode de paiement est null.");
      }

      // Mettre à jour la base de données avec les informations de paiement
      const amountPaid = paymentIntent.amount_received || paymentIntent.amount;
      await tables.payment.queryAddPayment({
        amount: amountPaid,
        payment_method: paymentMethodUsed, // S'assurer que l'ID de la méthode de paiement n'est pas null
        discount_id: promoCode || null,
        user_id: id,
        price_id: price.id, // Enregistrer le priceId
      });
      res.json({ message: `Paiement réussi pour le prix ${price.id}` });
    } else {
      res.json({ error: "Paiement échoué" });
    }
  } catch (err) {
    next(err);
  }
};

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
    const { paymentIntentId, promoId } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      await tables.payment.queryAddPayment({
        amount: paymentIntent.amount_received,
        payment_method: paymentIntent.payment_method,
        discount_id: promoId || null,
        user_id: id,
      });

      res.json({ message: "Payment réussi" });
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
