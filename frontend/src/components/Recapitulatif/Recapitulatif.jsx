import { useState, useContext } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { FaLock, FaShieldAlt, FaCreditCard } from "react-icons/fa";
import { RiSecurePaymentLine } from "react-icons/ri";
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
          color: "gray",
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
  const [promoError, setPromoError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [is3dSecurewait, setIs3dSecurewait] = useState(false);
  const [codePromo, setCodePromo] = useState("");
  const [eventCreated, setEventCreated] = useState(false);
  const [eventToken, setEventToken] = useState(null);
  const [receiptUrl, setReceiptUrl] = useState(null);
  const [promoReduction, setPromoReduction] = useState(null);

  const submitPromo = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userDiscount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: JSON.stringify({ promoCode: codePromo }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            return Promise.reject(
              new Error(error.message || "Erreur inconnue.")
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.info("data", data);
        if (data.success) {
          setPromoReduction(data.promo);
          setPromoError(null); // Stocker la réduction
        } else {
          setPromoError(data.message);
          setCodePromo("");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setPromoError(
          "Erreur lors de l'application du code promo, veuillez réessayer."
        );
        setCodePromo("");
      });
  };

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
                // eslint-disable-next-line no-shadow
                return response.json().then((error) => {
                  return Promise.reject(
                    new Error(error.message || "Erreur inconnue.")
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
                setNerror(error.message);
              } else {
                setNerror("Une erreur est survenue, veuillez réessayer.");
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
    <div className="lg:bg-[#281f31] text-white border-2 border-gray-600 rounded-2xl  my-8 flex flex-col p-6 items-start space-y-4 w-full max-w-2xl">
      <h1 className="text-2xl font-bold text-center w-full mb-4">
        Récapitulatif
      </h1>

      <p className="text-lg">
        <strong>Événement :</strong> {selectedEvent.city}
      </p>

      <p className="text-lg">
        <strong>Adresse :</strong> {selectedEvent.address}
      </p>

      <p className="text-lg">
        <strong>Date :</strong>{" "}
        {new Date(selectedEvent.date).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      <p className="text-lg">
        <strong>Formule :</strong> {selectedFormula.title}
      </p>

      <p className="text-lg">
        <strong>Prix :</strong> {selectedFormula.price} €
        {promoReduction && (
          <span className="text-green-500">
            {" "}
            (-{promoReduction} % de réduction appliqué)
          </span>
        )}
      </p>
      {promoReduction ? (
        <p className="text-lg">
          <strong>Prix après réduction : </strong>
          {promoReduction
            ? (selectedFormula.price * (1 - promoReduction / 100)).toFixed(2)
            : selectedFormula.price}{" "}
          €
        </p>
      ) : (
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 items-center w-full">
          <div className="flex items-center space-x-2">
            <label htmlFor="codePromo" className="text-lg">
              <strong>Code Promo :</strong>
            </label>
            <input
              type="text"
              id="codePromo"
              className="rounded-lg p-2 text-white border border-gray-300 focus:border-white focus:outline-none bg-gray-800"
              value={codePromo}
              onChange={(e) => setCodePromo(e.target.value)}
              placeholder="Entrez le code promo"
            />
          </div>

          <button
            onClick={submitPromo}
            className="mt-4 text-md font-bold text-center text-secondary bg-primary focus:outline-none font-semibold
            bg-gradient-to-r from-[#4CACFF] via-[#A070EF] to-[#8E78DA] rounded-xl hover:bg-gradient-to-r hover:from-[#4CACFF] hover:via-[#4CACFF] hover:to-[#4CACFF] ease-in font-secondary-font p-2"
          >
            Appliquer
          </button>
        </div>
      )}

      {promoError && (
        <p className="text-red-600 text-sm mt-2 mb-5">{promoError}</p>
      )}

      <span className="w-full h-0.5 bg-white mt-40" />

      <h3 className="text-2xl font-bold text-center w-full mb-4">Paiement</h3>
      <div className="mb-4 max-w-full w-full">
        <label
          className="block text-white text-sm font-medium mb-2"
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

      <div className="mb-4 flex space-x-4 w-full">
        <div className="w-1/2">
          <label
            className="block text-white text-sm font-medium mb-2"
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
            className="block text-white text-sm font-medium mb-2"
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

      <div className="w-full p-4 bg-[#1f1725] rounded-lg mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <FaLock className="text-green-500 text-xl" />
            <div className="text-left">
              <p className="text-xs font-bold">Cryptage SSL</p>
              <p className="text-[10px] text-gray-300">
                Vos données sont protégées
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-green-500 text-xl" />
            <div className="text-left">
              <p className="text-xs font-bold">Paiement Vérifié</p>
              <p className="text-[10px] text-gray-300">
                Transaction 100% sécurisée
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaCreditCard className="text-green-500 text-xl" />
            <div className="text-left">
              <p className="text-xs font-bold">Cartes Acceptées</p>
              <p className="text-[10px] text-gray-300">Visa, Mastercard, CB</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RiSecurePaymentLine className="text-green-500 text-xl" />
            <div className="text-left">
              <p className="text-xs font-bold">3D Secure</p>
              <p className="text-[10px] text-gray-300">
                Authentication renforcée
              </p>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="w-full text-center">
        {/* <button type="submit" disabled={loading}> */}
        <button
          className="mt-4 text-md font-bold text-center text-secondary bg-primary focus:outline-none font-semibold
            bg-gradient-to-r from-[#4CACFF] via-[#A070EF] to-[#8E78DA] rounded-xl hover:bg-gradient-to-r hover:from-[#4CACFF] hover:via-[#4CACFF] hover:to-[#4CACFF] ease-in font-secondary-font p-2"
        >
          {!loading ? (
            <p className="font-medium">Passer Au Paiement</p>
          ) : (
            <Loader />
          )}
        </button>
        {is3dSecurewait && (
          <h4 className="text-white">3D Secure en attente...</h4>
        )}
        {nerrors && <p className="text-red-600 p-5">{nerrors}</p>}
      </form>
    </div>
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
    </div>
  );
}
