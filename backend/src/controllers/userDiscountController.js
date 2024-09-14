const tables = require("../tables");

const getUserDiscount = async (req, res, next) => {
  try {
    const userDiscount = await tables.user_discount.getUserDiscountAll();
    const id = req.payload;
    const [admin] = await tables.user.getUserById(id);

    if (admin[0].is_admin !== "admin" && admin[0].is_admin !== "superAdmin") {
      res.status(401).json({ error: "Vous n'avez pas les droits" });
    } else {
      res.json(userDiscount);
    }
  } catch (err) {
    next(err);
  }
};

const checkDiscount = async (req, res) => {
  try {
    const { promoCode } = req.body;

    // Logique de validation du code promo...
    const discounts = await tables.discount.getDiscountAll();
    const promotionCodes = discounts.filter((d) => d.promo_code === promoCode);

    if (promotionCodes.length === 0) {
      // Si aucun code promo n'est trouvé, on renvoie directement une réponse JSON
      return res.status(404).json({
        success: false,
        message: "Code promo introuvable.",
      });
    }

    const validCodesPromises = promotionCodes.map(async (promotionCode) => {
      if (promotionCode.status === 1) {
        const currentDate = new Date();
        const validityDate = new Date(promotionCode.duree_de_validite);
        if (currentDate <= validityDate && promotionCode.quantity > 0) {
          return promotionCode;
        }
      }
      return null;
    });

    const validCodes = await Promise.all(validCodesPromises);
    const validPromotionCodes = validCodes.filter((code) => code !== null);

    if (validPromotionCodes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Ce code promo n'est plus valide.",
      });
    }

    const bestPromotionCode = validPromotionCodes.reduce(
      (bestCode, currentCode) => {
        if (currentCode.percent_value > (bestCode?.percent_value || 0)) {
          return currentCode;
        }
        return bestCode;
      },
      null
    );

    // Si tout est bon, renvoyer les infos du meilleur code promo
    return {
      success: true,
      bestPromotionCode,
    };
  } catch (error) {
    console.error("Erreur lors de l'application du code promo:", error);
    // Renvoyer l'erreur au format JSON
    return res.status(500).json({
      success: false,
      message: "Erreur interne du serveur.",
    });
  }
};

const addUserDiscount = async (req, res, next) => {
  try {
    const id = req.payload;
    // Logique de validation du code promo...
    const discountValid = await checkDiscount(req, res, next);

    if (discountValid.success && discountValid.bestPromotionCode) {
      const promotionCode = discountValid.bestPromotionCode;
      const [usedPromo] = await tables.user_discount.getIdController({
        user_id: id,
        discount_id: promotionCode.id,
      });

      if (usedPromo.length > 0) {
        res.json({
          success: false,
          message: "Code promo déjà utilisé par cet utilisateur",
        });
      } else {
        // décrémenté au moment du paiement
        // await tables.discount.decrementdiscountQuantity({
        //   discount_id: promotionCode.discount_id,
        // });
        await tables.user_discount.addUserDiscount(id, promotionCode.id);
        res.json({
          success: true,
          message: "Code promos valide",
          promo: promotionCode.percent_value,
        });
      }
    } else {
      res.json({
        success: false,
        message: "Code promos invalide",
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { getUserDiscount, addUserDiscount, checkDiscount };
