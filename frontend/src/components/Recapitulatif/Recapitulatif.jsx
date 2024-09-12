import { useState, useContext } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { UserContext } from "../../context/UserContext";
import TicketViewer from "../Copilot/PdfTicket/TicketViewer";
import Loader from "../loader/Loader";

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types

export default function Recapitulatif({
  selectedEvent,
  selectedFormula,
  formUserInfos,
  ifEventCreated,
}) {
  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "white",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "grey",
        },
      },
      invalid: {
        color: "red",
        iconColor: "red",
      },
    },
  };

  const { user } = useContext(UserContext);
  const stripe = useStripe();
  const elements = useElements();

  const [errors, setErrors] = useState({});
  const [nerrors, setNerror] = useState(null);
  const [loading, setLoading] = useState(false);
  const [is3dSecurewait, setIs3dSecurewait] = useState(false);
  const [codePromo, setCodePromo] = useState("");
  const [eventCreated, setEventCreated] = useState(false);
  const [eventToken, setEventToken] = useState(null);
  const [receiptUrl, setReceiptUrl] = useState(null);

  const validate = () => {
    const validationErrors = {};

    if (!elements.getElement(CardNumberElement)) {
      validationErrors.numcard =
        "Veuillez renseigner un numéro de carte valide.";
    }
    if (!elements.getElement(CardExpiryElement)) {
      validationErrors.expDate =
        "Veuillez renseigner une date d'expiration valide.";
    }
    if (!elements.getElement(CardCvcElement)) {
      validationErrors.cvc = "Veuillez renseigner un code CVC valide.";
    }
    if (!stripe || !elements) {
      validationErrors.stripe = "Une erreur est survenue avec Stripe.";
    }
    setErrors(validationErrors);
    return validationErrors;
  };

  const handlePayment = async (payResult) => {
    console.info("payResult", payResult);
    if (payResult && payResult.status === "requires_action") {
      setIs3dSecurewait(true);
      setNerror(null);
      const { error: confirmationError } = await stripe.confirmCardPayment(
        payResult.clientSecret
      );

      if (confirmationError) {
        setIs3dSecurewait(false);
        setNerror("Erreur lors de l'authentification 3D Secure.");
        setLoading(false); // Assurez-vous de stopper le loading même en cas d'erreur
      } else {
        const bodyToCheck = {
          paymentIntentId: payResult.paymentIntentId,
          event_id: selectedEvent.id,
          user_id: user.data.id,
        };
        if (payResult.discount_id) {
          bodyToCheck.discount_id = payResult.discount_id;
        }

        // Utilisation des backticks pour l'interpolation de l'URL
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`, // Utilisation correcte de Bearer
          },
          body: JSON.stringify(bodyToCheck),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.data.status === "accepted") {
              console.info("evenement souscris avec succès", true);
              setIs3dSecurewait(false);
              setNerror(null);
              setEventCreated(true);
              setNerror(null);
              setEventToken(data.data.token);
              setReceiptUrl(data.data.receipt_url);
              ifEventCreated(true);
            } else {
              setNerror("Erreur lors de l'abonnement");
              setIs3dSecurewait(false);
              setLoading(false);
            }
            // setLoading(false); // Arrête le loading ici aussi
          })
          .catch((errorback) => {
            console.error("Error:", errorback);
            setNerror("Erreur lors de la vérification du paiement.");
            setLoading(false); // Arrête le loading même en cas d'erreur
          });
      }
    } else if (payResult.status === "accepted") {
      console.info("evenement souscris avec succès", payResult.token);
      setIs3dSecurewait(false);
      setEventToken(payResult.token);
      setReceiptUrl(payResult.receipt_url);
      setNerror(null);
      setEventCreated(true);
      ifEventCreated(true);
      // setLoading(false);
    } else {
      setIs3dSecurewait(false);
      setNerror("Erreur lors de l'abonnement.");
      setLoading(false); // Arrête le loading en cas d'er
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      const cardNumberElement = elements.getElement(CardNumberElement);

      try {
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardNumberElement,
          billing_details: {
            name: `${user.data.firstname} ${user.data.lastname}`,
            email: user.data.email,
            address: {
              line1: formUserInfos.adresse_postale,
              city: formUserInfos.value,
              postal_code: formUserInfos.codepostal,
              country: "FR",
            },
          },
        });

        if (error) {
          throw error;
        } else {
          // Envoyer le paiement au backend
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
            },
            body: JSON.stringify({
              paymentMethodId: paymentMethod.id,
              stripeEmail: user.data.email,
              priceId: selectedFormula.stripeId,
              email: user.data.email,
              promoCode: codePromo,
              event_id: selectedEvent.id,
            }),
          })
            .then((response) => {
              // Vérifier si la réponse a un statut HTTP d'erreur
              if (!response.ok) {
                return response.json().then((errorData) => {
                  return Promise.reject(
                    new Error(errorData.error || "Erreur inconnue.")
                  ); // Propager l'erreur avec le message
                });
              }
              return response.json(); // Si tout est OK, traiter la réponse JSON
            })
            .then((data) => {
              handlePayment(data.data); // Continuer avec la logique de paiement
            })
            // eslint-disable-next-line no-shadow
            .catch((error) => {
              setLoading(false);
              // Vérifier si le message d'erreur correspond à une situation spécifique
              if (
                error.message === "Ce code promo n'est plus valide." ||
                error.message === "Code promo introuvable." ||
                error.message === "Vous êtes déjà inscrit à cet événement."
              ) {
                setNerror(error.message); // Afficher l'erreur spécifique liée au code promo ou inscription
              } else {
                setNerror("Une erreur est survenue, veuillez réessayer."); // Message d'erreur générique
              }
            });
        }
      } catch (error) {
        setNerror("Une erreur est survenue, veillez réessayer.");
        setLoading(false);
      }
    }
  };

  return !eventCreated ? (
    <>
      <div className="text-white border-2 border-red-600 my-8 flex flex-col p-4 items-start ">
        <h1 className="self-center">Récapitulatif</h1>
        <p>Événement : {selectedEvent.city}</p>
        <p>Adresse : {selectedEvent.address}</p>
        <p>
          Date :{" "}
          {new Date(selectedEvent.date).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p>Formule : {selectedFormula.title}</p>
        <p>Prix : {selectedFormula.price} €</p>
        <div className="flex flex-row gap-2">
          <p>Code Promo : </p> &nbsp;
          <input
            type="text"
            className="rounded text-black p-2"
            value={codePromo}
            onChange={(e) => setCodePromo(e.target.value)}
          />
        </div>
      </div>
      <div className="max-w-xl mx-auto w-2/4 bg-gray-900 shadow-lg rounded-lg p-6 mb-6">
        <div className="mb-4">
          <label
            className="block text-gray-300 text-sm font-medium mb-2"
            htmlFor="card-number"
          >
            Numéro de Carte
          </label>
          <div className="border border-gray-300 rounded-md p-3">
            <CardNumberElement
              id="card-number"
              options={CARD_ELEMENT_OPTIONS}
              className="w-full focus:outline-none"
            />
          </div>
          {errors.numcard && <p className="text-red-600">{errors.numcard}</p>}
        </div>

        <div className="mb-4 flex space-x-4 ">
          <div className="w-1/2">
            <label
              className="block text-gray-300 text-sm font-medium mb-2"
              htmlFor="card-expiry"
            >
              Date d'Expiration
            </label>
            <div className="border border-gray-300 rounded-md p-3">
              <CardExpiryElement
                id="card-expiry"
                options={CARD_ELEMENT_OPTIONS}
                className="w-full focus:outline-none"
              />
            </div>
            {errors.expDate && <p className="text-red-600">{errors.expDate}</p>}
          </div>

          <div className="w-1/2">
            <label
              className="block text-gray-300 text-sm font-medium mb-2"
              htmlFor="card-cvc"
            >
              CVC
            </label>
            <div className="border border-gray-300 rounded-md p-3">
              <CardCvcElement
                id="card-cvc"
                options={CARD_ELEMENT_OPTIONS}
                className="w-full focus:outline-none"
              />
            </div>
            {errors.cvc && <p className="text-red-600">{errors.cvc}</p>}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* <button type="submit" disabled={loading}> */}
        <button
          type="submit"
          className="bg-green-600 text-white rounded px-2 mb-4"
        >
          {!loading ? "Passer Au Paiement" : <Loader />}
        </button>
        {is3dSecurewait && (
          <h4 className="text-white">3D Secure en attente...</h4>
        )}
        {nerrors && <p className="text-red-600">{nerrors}</p>}
      </form>
    </>
  ) : (
    <div className="pdf-preview w-2/4 py-8">
      <h3 className="text-2xl font-bold mb-4 text-left text-white">
        Félicitations, <br /> vous avez souscrit à l'événement avec succès !
      </h3>

      {eventToken ? (
        <TicketViewer token={eventToken} receiptUrl={receiptUrl} />
      ) : (
        <Loader />
      )}

      <a
        href="/"
        className="bg-red-600 hover:bg-red-900 text-white font-bold py-2 px-4 rounded m-30"
      >
        Retour
      </a>
    </div>
  );
}
