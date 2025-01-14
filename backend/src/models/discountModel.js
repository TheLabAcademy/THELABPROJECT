/* eslint-disable camelcase */
// const db = require("../../database/client");
const AbstractManager = require("./AbstractManager");

class discountManager extends AbstractManager {
  constructor() {
    super({ table: "discount" });
  }

  async getDiscountAll() {
    const [get] = await this.database.query(`select * from ${this.table} `);
    return get;
  }

  async addDiscount({
    percent_value,
    promo_code,
    quantity,
    duree_de_validite,
  }) {
    const [add] = await this.database.query(
      `insert into ${this.table}(percent_value, promo_code, quantity, duree_de_validite) values (?, ?, ?, ?)`,
      [percent_value, promo_code, quantity, duree_de_validite]
    );
    return add;
  }

  async getDiscountById(id) {
    // Requête SQL pour récupérer les informations du code promo via son id
    const [discount] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return discount;
  }

  async updateDiscount(id, updateFields) {
    // Créer une chaîne de requête SQL dynamique
    const setClause = Object.keys(updateFields)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = Object.values(updateFields);

    values.push(id);

    return this.database.query(
      `UPDATE ${this.table} SET ${setClause} WHERE id = ?`,
      values
    );
  }

  // async deleteDiscount({ discount_id }) {
  //   return this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [
  //     discount_id,
  //   ]);
  // }

  async decrementdiscountQuantity({ discount_id }) {
    const add = await this.database.query(
      `UPDATE ${this.table} SET quantity = quantity - 1 WHERE id = ?`,
      [discount_id]
    );
    console.info("add", add);
    return add;
  }

  async statusDiscount({ discount_id }) {
    const status = await this.database.query(
      `UPDATE ${this.table} SET status = 0 WHERE id = ?`,
      [discount_id]
    );
    return status;
  }

  async queryAddDiscountById(id) {
    return this.database.query(
      `SELECT percent_value FROM ${this.table} where id = ?`,
      [id]
    );
  }

  async updateStatusDiscount(id) {
    return this.database.query(
      `UPDATE ${this.table} SET status = false where id = ?`,
      [id]
    );
  }
}

module.exports = discountManager;
