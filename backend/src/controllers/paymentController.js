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
    const id = req.payload;
    console.info("id", req.body);
    const { stripeCustomerId, planId, promoCode, paymentMethodId, email } =
      req.body;
    console.info(
      "stripeCustomerId",
      stripeCustomerId,
      planId,
      promoCode,
      paymentMethodId
    );

    let customerId = stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: email,
      });
      customerId = customer.id;
    }

    let promotionCodeId = null;
    if (promoCode) {
      // Lister tous les codes promotionnels
      const promotionCodes = await stripe.promotionCodes.list();

      // Trouver le code promotionnel correspondant au code promo fourni
      const promotionCode = promotionCodes.data.find(
        (p) => p.code === promoCode
      );

      if (promotionCode) {
        promotionCodeId = promotionCode.id;
      } else {
        return res.status(400).json({ error: "Code promo invalide." });
      }
    }
    const subscription = await stripe.subscriptions.create({
      default_payment_method: paymentMethodId,
      customer: customerId,
      items: [{ plan: planId }],
      ...(promotionCodeId && { promotion_code: promotionCodeId }),
      expand: ["latest_invoice.payment_intent"],
    });

    const paymentIntent = subscription.latest_invoice.payment_intent;

    if (
      paymentIntent.status === "requires_action" ||
      paymentIntent.status === "requires_payment_method"
    ) {
      res.json = {
        data: {
          subscriptionId: subscription.id,
          planId: planId,
          clientSecret: paymentIntent.client_secret,
          status: "requires_action",
        },
      };
    } else if (subscription.status === "active") {
      // Mettre à jour les informations Stripe dans la base de données
      const amountPaid = paymentIntent.amount_received || paymentIntent.amount; // selon ce que Stripe retourne

      // Mettre à jour les informations Stripe dans la base de données
      await tables.payment.queryAddPayment({
        amount: amountPaid, // Montant réellement payé
        paymentMethodId: paymentIntent.payment_method,
        discount_id: promotionCodeId || null, // Vérifiez si vous avez un discount_id
        user_id: id, // ID de l'utilisateur concerné
      });
      res.json({ message: "Payment réussi" });
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
module.exports = { getPayment, addPayment, updatePayment, deletePayment };
