/* eslint-disable camelcase */
// eslint-disable-next-line consistent-return
/* eslint-disable no-unused-vars */
// const discountModel = require("../models/discountModel");
const tables = require("../tables");

// eslint-disable-next-line consistent-return
const getDiscount = async (req, res) => {
  try {
    const id = req.payload;
    const [admin] = await tables.user.getUserById(id);

    // Vérification des droits d'administration
    if (admin[0].is_admin !== "admin" && admin[0].is_admin !== "superAdmin") {
      return res.status(401).json({ error: "Vous n'avez pas les droits" });
    }

    // Récupération des remises
    const discounts = await tables.discount.getDiscountAll();
    const currentDate = Date.now();

    // Vérification de la date et mise à jour du statut
    const updatedDiscounts = await Promise.all(
      discounts.map(async (discount) => {
        // Si la remise est expirée, mettre à jour le statut
        if (new Date(discount.duree_de_validite) <= new Date(currentDate)) {
          await tables.discount.updateStatusDiscount(discount.id);
          return discount; // Retourner la remise mise à jour
        }
        return discount; // Retourner la remise sans mise à jour
      })
    );

    res.send(updatedDiscounts);
  } catch (error) {
    res.sendStatus(500);
  }
};

const addDiscount = async (req, res, next) => {
  try {
    const id = req.payload;
    const [admin] = await tables.user.getUserById(id);

    if (admin[0].is_admin !== "admin" && admin[0].is_admin !== "superAdmin") {
      res.status(401).json({ error: "Vous n'avez pas les droits" });
    }
    const promo = req.body;
    const discount = await tables.discount.addDiscount(promo);
    res.json(discount);
  } catch (err) {
    next(err);
  }
};

const updateDiscount = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { percent_value, promo_code, quantity, duree_de_validite } = req.body;

    const updateFields = {};

    if (percent_value !== undefined) {
      updateFields.percent_value = percent_value;
    }
    if (promo_code !== undefined) {
      updateFields.promo_code = promo_code;
    }
    if (quantity !== undefined) {
      updateFields.quantity = quantity;
    }
    if (duree_de_validite !== undefined) {
      updateFields.duree_de_validite = duree_de_validite;
    }
    const ids = req.payload;
    const [admin] = await tables.user.getUserById(ids);

    if (admin[0].is_admin !== "admin" && admin[0].is_admin !== "superAdmin") {
      res.status(401).json({ error: "Vous n'avez pas les droits" });
    } else {
      const [discount] = await tables.discount.updateDiscount(id, updateFields);
      res.status(200).json(discount);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const deleteDiscount = async (req, res) => {
//   const { id } = req.params;
//   console.info("id", id);
//   try {
//     await tables.discount.deleteDiscount({ discount_id: id });

//     res.json({ message: "Discount a bien été supprimer" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

module.exports = { getDiscount, addDiscount, updateDiscount };
