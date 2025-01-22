/* eslint-disable camelcase */
const AbstractManager = require("./AbstractManager");

class EventManager extends AbstractManager {
  constructor() {
    super({ table: "event" });
  }

  async createEvents(city, date, address, quantity) {
    return this.database.query(
      `INSERT INTO ${this.table} (city, date, address, quantity) VALUES (?,?,?,?)`,
      [city, date, address, quantity]
    );
  }

  async getAllEvent() {
    return this.database.query(`SELECT * FROM ${this.table}`);
  }

  async updateEvent(id, updateFields) {
    // Créer une chaîne de requête SQL dynamique
    const setClause = Object.keys(updateFields)
      .map((key) => `${key} = ?`)
      .join(", ");

    // Créer un tableau de valeurs basé sur les valeurs de l'objet updateFields
    const values = Object.values(updateFields);

    // Ajouter l'id à la fin du tableau de valeurs
    values.push(id);

    return this.database.query(
      `UPDATE ${this.table} SET ${setClause} WHERE id = ?`,
      values
    );
  }

  async deleteEvent(id) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
  }

  async getEventById(id) {
    return this.database.query(`SELECT * FROM ${this.table} WHERE id = ?`, [
      id,
    ]);
  }

  async updateStatusEvent(id) {
    return this.database.query(
      `UPDATE ${this.table} SET status = "inactive" where id = ?`,
      [id]
    );
  }

  async decrementEventQuantity(event_id) {
    return this.database.query(
      `UPDATE event SET quantity = quantity - 1 WHERE id = ?`,
      [event_id]
    );
  }

  async desactivateEvent() {
    return this.database.query(
      // `UPDATE ${this.table} SET status = "inactive" WHERE id = ?`,
      `select * from ${this.table}`
      // [id]
    );
  }
}
module.exports = EventManager;
