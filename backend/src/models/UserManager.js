/* eslint-disable no-restricted-syntax */
const crypto = require("crypto");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const hashPassword = require("../services/hashedPassword");

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: "api",
  key: "ca44c3911b7ef5d13f5cde057da3623f-9c3f0c68-29c9d103", // Remplacez par votre clef API Mailgun
});

const AbstractManager = require("./AbstractManager");

class UserManager extends AbstractManager {
  constructor() {
    super({ table: "user" });
  }

  async addUser(lastname, firstname, email, hashedPassword, birthday) {
    return this.database.query(
      `INSERT INTO ${this.table} (lastname, firstname, email, hashedPassword, birthday) VALUES (?, ?, ?, ?, ?)`,
      [lastname, firstname, email, hashedPassword, birthday]
    );
  }

  async getAllUsers() {
    return this.database.query(
      `SELECT * FROM ${this.table} LEFT JOIN user_info ON user.id = user_info.user_id`
    );
  }

  async getAllUserss() {
    return this.database.query(`SELECT * FROM ${this.table}`);
  }

  async updateUser(id, updateFields) {
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

  updateUserOnlyPassword(id, hashedPassword) {
    return this.database.query(
      `UPDATE ${this.table} set hashedPassword = ? where id=?`,
      [hashedPassword, id]
    );
  }

  async getUserByEmail(value) {
    return this.database.query(`SELECT * FROM ${this.table} WHERE email = ?`, [
      value,
    ]);
  }

  async getUserById(id) {
    return this.database.query(
      `SELECT * FROM ${this.table} LEFT JOIN user_info ON user.id = user_info.user_id where user.id= ?`,
      [id]
    );
  }

  async deleteUser(id) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
  }

  // Methode pour réinisialiser le mot de passe
  async createPasswordResetToken(email) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure

    await this.updateUser(user.id, {
      resetPasswordToken: token,
      resetPasswordExpires: user.resetPasswordExpires,
    });

    return token;
  }

  // eslint-disable-next-line class-methods-use-this
  async sendPasswordResetEmail(tokenResetPassword, email) {
    const domain = "sandbox13c734a82a994f099e3a1574814583c5.mailgun.org";
    try {
      const response = await mg.messages.create(domain, {
        from: `Support <thelabfr.contact@gmail.com>`, // Expéditeur
        to: [email], // Destinataire
        subject: "Réinitialisation de votre mot de passe THELAB-ACADEMY", // Sujet
        text: `Bonjour,
  
          Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien suivant pour le réinitialiser :
          
          https://thelab-academy.fr/reset?token=${tokenResetPassword}
          
          Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.
          
          Cordialement,
          L'équipe Support`,
        html: `
          <p>Bonjour,</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien suivant pour le réinitialiser :</p>
          <a href="https://thelab-academy.fr/reset?token=${tokenResetPassword}">
            Réinitialiser mon mot de passe
          </a>
          <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
          <p>Cordialement,</p>
          <p>L'équipe Support</p>
        `,
      });

      console.log("Email envoyé avec succès :", response);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email :", error.message);
    }
  }

  async resetPassword(user, newPassword) {
    const hashedPassword = await hashPassword(newPassword);
    await this.updateUser(user.id, {
      // eslint-disable-next-line object-shorthand
      hashedPassword: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }

  async setTemporaryPassword(userId, hashedPassword) {
    return this.database.query(
      `UPDATE ${this.table} SET hashedPassword = ? WHERE id = ?`,
      [hashedPassword, userId]
    );
  }

  // METHODES A AJOUTER APRES LA CREATION DU BACKOFFICE //

  async desactivateUser(id) {
    return this.database.query(
      `UPDATE ${this.table} SET status = 'inactive' WHERE id = ?`,
      [id]
    );
  }

  async activateUser(id) {
    return this.database.query(
      `UPDATE ${this.table} SET status = 'active' WHERE id = ?`,
      [id]
    );
  }

  async setUserAdmin(userId) {
    return this.database.query(
      `UPDATE ${this.table} SET is_admin = 'admin' WHERE id = ?`,
      [userId]
    );
  }

  async setUserNotAdmin(id) {
    return this.database.query(
      `UPDATE ${this.table} SET is_admin = 'user' WHERE id = ?`,
      [id]
    );
  }

  // get total users
  async getTotalUsersCount() {
    return this.database.query(
      `SELECT COUNT(*) AS totalUsers FROM ${this.table}`
    );
  }

  // ********************************************* //
}

module.exports = UserManager;
