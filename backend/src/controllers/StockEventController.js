/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */

const crypto = require("crypto");
const tables = require("../tables");

// eslint-disable-next-line consistent-return
const getAllStockEvents = async (req, res) => {
  try {
    const id = req.payload;
    const [admin] = await tables.user.getUserById(id);

    if (admin[0].is_admin !== "admin" && admin[0].is_admin !== "superAdmin") {
      return res.status(401).json({ error: "Vous n'avez pas les droits" });
    }
    const [stockEvents] = await tables.stock_event.getAllStockEvent();
    res.status(200).json(stockEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createStockEvent = async (req, res, charge) => {
  try {
    const event_id = req.body;
    const user_id = req.payload;

    // Vérifiez si l'utilisateur est déjà inscrit
    const checkUserInEvent = await tables.stock_event.checkUserEvent(
      event_id.event_id,
      user_id,
      charge
    );
    if (checkUserInEvent[0].length > 0) {
      return res
        .status(400)
        .json({ error: "L'utilisateur est déjà inscrit à cet événement" });
    }

    // Créez l'événement sans token et unique_string
    const [createEventResult] = await tables.stock_event.createStockEvent(
      event_id.event_id,
      user_id,
      charge.id
    );

    if (createEventResult.affectedRows === 1) {
      // Récupérez l'événement nouvellement créé
      const [stockEventResult] = await tables.stock_event.checkUserEvent(
        event_id.event_id,
        user_id
      );

      const stockEvent = stockEventResult[0]; // Supposons que le premier élément est l'événement
      // Extraire la date de createdAt
      const createdAtString = stockEvent.created_at;
      // Convertir la chaîne au format ISO compatible pour JavaScript
      const createdAtDate = new Date(createdAtString);
      // Utilisation d'un timestamp pour simplifier la date
      const timestamp = createdAtDate.getTime(); // Utilise le timestamp en millisecondes
      // Générer une chaîne unique basée sur le timestamp, l'ID de l'événement et l'ID de l'utilisateur
      const uniqueString = `${timestamp}-${event_id.event_id}-${user_id}`;

      // Créer un token unique à partir de cette chaîne
      const token = crypto
        .createHash("sha256")
        .update(uniqueString)
        .digest("hex");

      // Mettre à jour l'événement avec le token et la chaîne unique
      const [updateEventResult] = await tables.stock_event.updateStockEvent(
        stockEvent.id,
        {
          token,
          unique_string: uniqueString,
        }
      );

      // Vérifiez si la mise à jour du token et unique_string a réussi
      if (updateEventResult.affectedRows === 1) {
        // Décrémentez la quantité disponible pour l'événement
        const [updateResult] = await tables.stock_event.decrementEventQuantity(
          event_id.event_id
        );
        if (updateResult.affectedRows === 1) {
          return res.status(201).json({
            data: {
              status: "accepted",
              date: stockEvent.createdAt,
              token, // Token unique basé sur la date de création
              unique_string: uniqueString,
              receipt_url: charge.receipt_url, // Inclure le lien du reçu Stripe
              // Unique string utilisée pour générer le token
            },
          });
        }
      }
    }

    return res.status(500).json({ error: "Failed to create Stock Event" });
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

const checkUserEventById = async (req, res) => {
  const user_id = req.payload;
  const [eventsForUser] = await tables.stock_event.checkUserEventById(user_id);
  if (eventsForUser.length === 0) {
    return res
      .status(404)
      .json({ error: "Vous n'êtes pas inscrit a un Event" });
  }
  res.status(200).json(eventsForUser);
};

const checkUserEventBUserId = async (req, res) => {
  const user_id = req.payload;
  const [eventsForUser] = await tables.stock_event.checkUserEventByUserId(
    user_id
  );
  if (eventsForUser.length === 0) {
    return res
      .status(404)
      .json({ error: "Vous n'êtes pas inscrit a un Event" });
  } else {
    res.status(200).json(eventsForUser);
  }
};

const checkUserEvent = async (req, res) => {
  try {
    const user_id = req.payload;
    const event_id = req.body;
    const [stockEvent] = await tables.stock_event.checkUserEvent({
      event_id,
      user_id,
    });
    if (stockEvent.length === 0) {
      return res
        .status(404)
        .json({ error: "Vous n'êtes pas inscrit a un Event" });
    } else {
      res.status(200).json(stockEvent);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStockEventByToken = async (req, res) => {
  try {
    const { token } = req.params; // Récupérer le token depuis les paramètres de la requête

    // Appeler la méthode dans le manager pour obtenir l'événement de stock via le token
    const [stockEvent] = await tables.stock_event.getStockEventByToken(token);

    if (stockEvent.length === 0) {
      return res
        .status(404)
        .json({ error: "Aucun événement de stock trouvé avec ce token." });
    }

    // Retourner les détails de l'événement trouvé
    return res.status(200).json({ data: stockEvent[0] });
  } catch (error) {
    return res.status(500).json({
      error: `Erreur lors de la récupération de l'événement: ${error.message}`,
    });
  }
};

module.exports = {
  getAllStockEvents,
  createStockEvent,
  checkUserEventById,
  checkUserEvent,
  checkUserEventBUserId,
  getStockEventByToken,
};
