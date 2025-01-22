/* eslint-disable consistent-return */
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const tables = require("../tables");

const getAllUsers = async (req, res) => {
  try {
    const id = req.payload;
    const [admin] = await tables.user.getUserById(id);

    if (admin[0].is_admin !== "admin" && admin[0].is_admin !== "superAdmin") {
      return res.status(401).json({ error: "Vous n'avez pas les droits" });
    }
    const [users] = await tables.user.getAllUsers();
    delete users[0].hashedPassword;
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUserss = async (req, res) => {
  try {
    const id = req.payload;
    const [admin] = await tables.user.getUserById(id);

    if (admin[0].is_admin !== "admin" && admin[0].is_admin !== "superAdmin") {
      return res.status(401).json({ error: "Vous n'avez pas les droits" });
    }
    const [users] = await tables.user.getAllUserss();
    delete users[0].hashedPassword;
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(401)
        .json({ error: "Email and password are required", status: 401 });
    } else {
      const [user] = await tables.user.getUserByEmail(email);
      if (user.length) {
        const isMatch = await argon2.verify(user[0].hashedPassword, password);
        if (typeof isMatch === "boolean" && isMatch) {
          const token = jwt.sign(
            { payload: user[0].id },
            process.env.SECRET_KEY_JWT,
            { expiresIn: "1h" }
          );
          res.status(200).json({ token, status: 200 });
        } else {
          res
            .status(401)
            .json({ message: "verifier vos informations", status: 401 });
        }
      } else {
        res
          .status(401)
          .json({ message: "l'adresse mail n'existe pas", status: 401 });
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.payload;
    const [user] = await tables.user.getUserById(userId);
    if (user.length) {
      delete user[0].hashedPassword;
      res.status(200).json({
        isLogged: true,
        message: `Welcome to THE LAB ${user[0].firstname} !`,
        data: user[0],
      });
    } else {
      res.status(404).send({
        isLogged: false,
        error: "User Not Found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      isLogged: false,
      error: error.message,
    });
  }
};

const addUser = async (req, res) => {
  try {
    const { lastname, firstname, email, hashedPassword, birthday } = req.body;
    const [results] = await tables.user.addUser(
      lastname,
      firstname,
      email,
      hashedPassword,
      birthday
    );
    if (!results.affectedRows) {
      res.json("User not added");
    } else {
      res.json("User added");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserWithoutPassword = async (req, res) => {
  try {
    const id = req.payload;
    // const { lastname, firstname, birthday } = req.body;
    const [user] = await tables.user.updateUser(id, req.body);
    if (user.affectedRows) {
      res.status(200).json({ message: "Utilisateur modifié avec succès" });
    } else {
      res.status(401).send("Problème lors de la modification de l'utilisateur");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const id = req.payload;
    const { hashedPassword } = req.body;
    console.info("coucou", hashedPassword);
    // Vérifier que l'utilisateur existe
    const [user] = await tables.user.getUserById(id);
    if (!user[0]) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier l'ancien mot de passe
    // try {
    //   const validPassword = await argon2.verify(
    //     user[0].hashedPassword,
    //     currentPassword
    //   );
    //   if (!validPassword) {
    //     return res
    //       .status(401)
    //       .json({ message: "Mot de passe actuel incorrect" });
    //   }
    // } catch (err) {
    //   console.error("Erreur lors de la vérification du mot de passe:", err);
    //   return res
    //     .status(500)
    //     .json({ message: "Erreur lors de la vérification du mot de passe" });
    // }

    // Hash le nouveau mot de passe
    // const newHashedPassword = await argon2.hash(hashedPassword);

    // Mettre à jour le mot de passe
    const [result] = await tables.user.updateUserOnlyPassword(
      id,
      hashedPassword
    );

    if (result.affectedRows) {
      res.status(200).json({ message: "Mot de passe modifié avec succès" });
    } else {
      res
        .status(500)
        .json({ message: "Problème lors de la modification du mot de passe" });
    }
  } catch (error) {
    console.error("Erreur lors de la modification du mot de passe:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.payload;
    const [admin] = await tables.user.getUserById(id);
    if (admin[0].is_admin !== "admin" && admin[0].is_admin !== "superAdmin") {
      return res.status(401).json({ error: "Vous n'avez pas les droits" });
    }
    const [user] = await tables.user.deleteUser(id);
    if (user.affectedRows) {
      res.status(200).json({
        message: "La suppression de l'utilisateur a été effectuée avec succès",
      });
    } else {
      res.status(401).send("Problème lors de la suppression de l'utilisateur");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPasswordResetToken = async (req, res) => {
  try {
    const { email } = req.body;
    console.info("email", email);
    const [user] = await tables.user.getUserByEmail(email);
    console.info("user", user);
    if (user.length) {
      const tokenResetPassword = jwt.sign(
        { payload: user[0].id },
        process.env.SECRET_KEY_JWT,
        { expiresIn: "0.5h" }
      );
      console.info("tokenResetPassword", tokenResetPassword);
      await tables.user.sendPasswordResetEmail(tokenResetPassword, email, req);
      res.status(200).json({
        message:
          "Votre demande a été prise en compte ! Un mail vous a été envoyé .",
      });
    } else {
      res.status(401).json({ message: "Email non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    // console.info("token", token);
    const tokenResetPassword = jwt.verify(token, process.env.SECRET_KEY_JWT);
    console.info("tokenResetPassword", tokenResetPassword);
    const { hashedPassword } = req.body;
    const [user] = await tables.user.updateUserOnlyPassword(
      tokenResetPassword.payload,
      hashedPassword
    );
    console.info("user", user);
    if (!user.affectedRows) {
      res.status(404).json({ error: "Token invalide ou expiré" });
    }
    res.status(200).json({ message: "Mot de passe réinitialisé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const setUserAdmin = async (req, res) => {
  try {
    const id = req.payload;
    const [admin] = await tables.user.getUserById(id);
    if (admin[0].is_admin !== "superAdmin") {
      return res.status(401).json({ error: "Vous n'avez pas les droits" });
    }
    const userId = req.body;
    const [result] = await tables.user.setUserAdmin(userId.id);
    if (result.affectedRows) {
      res.status(200).json({ message: "Utilisateur est maintenant Admin" });
    } else {
      res.status(401).send("Problème lors de la modification de l'utilisateur");
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const setUserNotAdmin = async (req, res) => {
  try {
    const id = req.payload;
    const [admin] = await tables.user.getUserById(id);

    if (admin[0].is_admin !== "superAdmin") {
      return res.status(401).json({ error: "Vous n'avez pas les droits" });
    }
    const userId = req.body;
    const [result] = await tables.user.setUserNotAdmin(userId.id);
    if (result.affectedRows) {
      res.status(200).json({ message: "Utilisateur n'est plus Admin" });
    } else {
      res.status(401).send("Problème lors de la modification de l'utilisateur");
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const desactivateUser = async (req, res) => {
  try {
    const id = req.payload;
    const [result] = await tables.user.desactivateUser(id);
    if (result.affectedRows) {
      res.status(200).json({ message: "Utilisateur est maintenant désactivé" });
    } else {
      res.status(401).send("Problème lors de la modification de l'utilisateur");
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const activateUser = async (req, res) => {
  try {
    const id = req.payload;
    const [result] = await tables.user.activateUser(id);
    if (result.affectedRows) {
      res.status(200).json({ message: "Utilisateur est maintenant activé" });
    } else {
      res.status(401).send("Problème lors de la modification de l'utilisateur");
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// get total users

const getTotalUsers = async (req, res) => {
  try {
    const id = req.payload;
    const [admin] = await tables.user.getUserById(id);

    if (admin[0].is_admin !== "admin" && admin[0].is_admin !== "superAdmin") {
      res.status(401).json({ error: "Vous n'avez pas les droits" });
    }

    const [totalUsers] = await tables.user.getTotalUsersCount();

    res.status(200).json({ totalUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const setTemporaryPassword = async (req, res) => {
  const { userId, temporaryPassword } = req.body;
  const id = req.payload;

  console.info("npmn");

  const [admin] = await tables.user.getUserById(id);

  if (admin[0].is_admin !== "superAdmin") {
    return res.status(401).json({ error: "Vous n'avez pas les droits" });
  }
  try {
    console.info("ouii", temporaryPassword);
    // Hash the temporary password
    const hashedPassword = await argon2.hash(temporaryPassword);

    // Update the password in database
    const [result] = await tables.user.setTemporaryPassword(
      userId,
      hashedPassword
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    res
      .status(200)
      .json({ message: "Mot de passe temporaire défini avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getAllUsers,
  getAllUserss,
  addUser,
  updateUserWithoutPassword,
  updatePassword,
  getUserByEmail,
  getUserById,
  deleteUser,
  createPasswordResetToken,
  resetPassword,
  setUserAdmin,
  setUserNotAdmin,
  desactivateUser,
  activateUser,
  getTotalUsers,
  setTemporaryPassword,
};
