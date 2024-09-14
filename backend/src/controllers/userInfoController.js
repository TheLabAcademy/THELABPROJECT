/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const fs = require("fs");
const tables = require("../tables");

const browse = async (req, res) => {
  try {
    const id = req.payload;
    const [admin] = await tables.user.getUserById(id);

    if (admin[0].is_admin !== "admin" && admin[0].is_admin !== "superAdmin") {
      return res.status(401).json({ error: "Vous n'avez pas les droits" });
    }
    const [userInfo] = await tables.user_info.getAllUserInfo();
    if (userInfo.length) {
      res.status(200).json({
        message: "Liste des informations utilisateur",
        userInfo,
      });
    } else {
      res
        .status(404)
        .json({ message: "Aucune information utilisateur trouvée" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const read = async (req, res) => {
  try {
    const id = req.payload;
    const userInfo = await tables.user_info.getUserInfoById(id);
    if (userInfo.length === 0) {
      res.status(404).json({ message: "User info not found..." });
    } else {
      res.json(userInfo[0]);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const edit = async (req, res) => {
  try {
    const id = req.payload;
    const {
      taille,
      poids,
      pointure,
      pied_fort,
      poste,
      sexe,
      numero_de_telephone,
      adresse_postale,
      ville,
    } = req.body;
    // const avatar = req.file.path;

    // Récupérer l'ancienne photo de l'utilisateur
    const oldUserInfo = await tables.user_info.getUserInfoById(id);
    // console.log("oldUserInfo", oldUserInfo);
    const oldAvatarPath = oldUserInfo[0][0].avatar;
    console.info("oldAvatarPath", oldAvatarPath);
    let { avatar } = oldUserInfo[0];
    if (req.file) {
      avatar = req.file.path;
    }
    // console.log("oldAvatarPath", oldAvatarPath);
    const updateFields = {
      taille,
      poids,
      pointure,
      pied_fort,
      poste,
      sexe,
      numero_de_telephone,
      adresse_postale,
      ville, // Ajouter l'avatar aux champs à mettre à jour
    };
    // Si un nouveau fichier a été téléchargé, ajouter l'avatar aux champs à mettre à jour
    if (req.file) {
      updateFields.avatar = avatar;
    }

    // Créer un nouvel objet qui ne contient que les champs qui ne sont pas undefined
    const definedFields = Object.entries(updateFields).reduce(
      (a, [k, v]) => (v === undefined ? a : { ...a, [k]: v }),
      {}
    );

    const [result] = await tables.user_info.updateSpecificUserInfoById(
      id,
      definedFields
    );

    if (result.affectedRows) {
      if (oldAvatarPath && req.file) {
        fs.unlinkSync(oldAvatarPath);
      }
      res.status(201).json({
        message: "Vos informations ont été mises à jour avec succès !",
      });
    } else {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(401).json({ message: "erreur lors de l'enregistrement" });
    }
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).send(error);
  }
};

const add = async (req, res) => {
  try {
    // Récupérer l'id de l'utilisateur depuis le token
    const user_id = req.payload;
    // Vérifier la validité du token
    if (!user_id) {
      return res.status(401).json({ message: "Token Invalide" });
    }
    // Vérifier si l'utilisateur a déjà ajouté ses informations
    const exist = await tables.user_info.getUserInfoById(user_id);
    if (exist[0].length) {
      fs.unlinkSync(req.file.path);
      return res
        .status(401)
        .json({ message: "Vous avez déjà ajouté vos informations" });
    }
    // Récupérer les informations utilisateur depuis le corps de la requête
    const {
      taille,
      poids,
      pointure,
      pied_fort,
      poste,
      sexe,
      numero_de_telephone,
      adresse_postale,
      ville,
    } = req.body;

    if (!taille || !poids || !pointure || !pied_fort || !poste || !sexe) {
      fs.unlinkSync(req.file.path);
      return res
        .status(400)
        .json({ message: "Ajoutez les champs necessaires" });
    }
    // Si un fichier d'avatar est téléchargé, mettre à jour le chemin de l'avatar
    // if (req.file) {
    //   userInfo.avatar = req.file.path;
    // }
    let avatar = null;
    if (req.file) {
      avatar = req.file.path;
    }
    // Appeler la méthode addUserInfo avec les informations utilisateur
    const [result] = await tables.user_info.addUserInfo(
      avatar,
      taille,
      poids,
      pointure,
      pied_fort,
      poste,
      sexe,
      numero_de_telephone,
      adresse_postale,
      ville,
      user_id
    );
    // Vérifier si l'opération d'insertion a réussi
    if (result.affectedRows) {
      res.json({ message: "User info added !" });
    } else {
      res.json({ message: "Error !" });
      fs.unlinkSync(req.file.path);
    }
  } catch (error) {
    res.status(500).send({ message: "Error !" });
    fs.unlinkSync(req.file.path);
  }
};

// delete: async (req, res, next) => {
//     try {
//         const userId = req.params.userId;
//         const result = await UserInfoManager.queryDeleteUserInfoById(userId);
//         if (result.affectedRows) {
//             res.json({ message: 'User info deleted :)' });
//         } else {
//             res.status(404).json({ message: 'User info not found :(' });
//         }
//     } catch (error) {
//         next(error);
//     }
// }

module.exports = {
  browse,
  read,
  edit,
  add,
};
