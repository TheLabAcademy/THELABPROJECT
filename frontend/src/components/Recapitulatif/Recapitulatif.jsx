import { useState, useContext } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { UserContext } from "../../context/UserContext"; // Assurez-vous que le chemin est correct
import Loader from "../loader/Loader";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types

export default function Recapitulatif({
  selectedEvent,
  selectedFormula,
  formUserInfos,
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

  console.info("user", user);
  console.info("formUserInfos", formUserInfos);
  console.info("selectedEvent", selectedEvent);
  console.info("selectedFormula", selectedFormula);
  const stripe = useStripe();
  const elements = useElements();
  const [bodyPay, setBodyPay] = useState([]);
  const [errors, setErrors] = useState({});
  const [nerrors, setNerror] = useState(null);
  const [clientSecretNew, setClientSecretNew] = useState(null);
  const { city, address, date } = selectedEvent;
  const { description, price, title } = selectedFormula;
  const [codePromo, setCodePromo] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkpay, setCheckpay] = useState(null);
  const [is3dSecurewait, setIs3dSecurewait] = useState(false);
  //   const handlePromoCode = (e) => {
  //     console.info("promo code");
  //   };

  const validate = () => {
    if (!stripe || !elements) {
      errors.stripe = "Une erreur est survenue";
    }
    if (!elements.getElement(CardNumberElement)) {
      errors.numcard = "Veuillez renseigner un numéro de carte valide";
    }
    if (!elements.getElement(CardExpiryElement)) {
      errors.expDate = "Veuillez renseigner une date d'expiration valide";
    }
    if (!elements.getElement(CardCvcElement)) {
      errors.cvc = "Veuillez renseigner un code CVC valide";
    }
    return errors;
  };

  const handlePayment = async (payResult) => {
    if (payResult) {
      const { status, clientSecret, subscriptionId } = payResult;
      console.info("payResult", payResult);
      if (payResult.status === "requires_action" && payResult.clientSecret) {
        setIs3dSecurewait(true);

        const { error: confirmationError } =
          await stripe.confirmCardPayment(clientSecret);

        if (confirmationError) {
          setIs3dSecurewait(false);
          console.info("Erreur lors de l'authentification 3D Secure", false);
          setNerror("Erreur lors de l'authentification 3D Secure");
        } else {
          const bodyToCheck = {
            paymentIntentId: payResult.paymentIntentId,
          };
          if (codePromo && codePromo.length > 0) {
            bodyToCheck.promoId = codePromo;
          }
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
            },
            body: JSON.stringify(bodyToCheck),
          })
            .then((response) => response.json())
            .then((data) => {
              console.info("data", data);
              if (data.status === "active") {
                setIs3dSecurewait(false);
                console.info("Abonnement créé ou modifié avec succès", true);
                setNerror(null);
              } else {
                setNerror("Erreur lors de l'abonnement");
              }
            })
            .catch((errorback) => console.error("Error:", errorback));
        }
      } else if (payResult.status === "active") {
        console.info("Abonnement créé ou modifié avec succès", true);
        setNerror(null);
      } else {
        setNerror("Erreur lors de l'abonnement");
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validErrors = validate();
    setErrors(validErrors);
    if (Object.keys(validErrors).length === 0) {
      if (!stripe || !elements) {
        return;
      }

      const cardNumberElement = elements.getElement(CardNumberElement);
      const cardExpiryElement = elements.getElement(CardExpiryElement);
      const cardCvcElement = elements.getElement(CardCvcElement);

      if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
        return;
      }

      try {
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardNumberElement,
          billing_details: {
            name: `${user.data.firstname} ${user.data.lastname}`,
            email: user.data?.email,
            address: {
              line1: formUserInfos?.adresse_postale,
              city: formUserInfos?.value,
              postal_code: formUserInfos?.codepostal,
              country: "FR",
            },
          },
        });

        if (error) {
          throw error;
        } else {
          const body = {
            paymentMethodId: paymentMethod.id,
            stripeEmail: user.data?.email,
            priceId: selectedFormula.stripeId,
            email: user.data?.email,
          };

          if (codePromo && codePromo.length > 0) {
            body.promoCode = codePromo;
          }

          setBodyPay(body);
          // setSendPayment(true);
          setLoading(true);
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
            },
            body: JSON.stringify(body),
          })
            .then((response) => response.json())
            .then((data) => {
              console.info("data", data);
              handlePayment(data.data);
              setLoading(false);
            })
            .catch((errorback) => console.error("Error:", errorback));
        }
      } catch (error) {
        console.info("Une erreur est surevenue", false);
      }
    }
  };

  // useEffect(() => {
  //   if (checkpay) {
  //     const { status } = checkpay;
  //     if (status === "active") {
  //       setIs3dSecurewait(false);
  //       openAlert("Abonnement créé ou modifié avec succès", true);
  //       verifyPro();
  //       closeModal();
  //       setNerror(null);
  //       reload(true);
  //     } else {
  //       openAlert("Erreur lors de l'abonnement", false);
  //       setNerror("Erreur lors de l'abonnement");
  //     }
  //   }
  // }, [checkpay]);

  return (
    <>
      <div className="text-white border-2 border-red-600 my-8 flex flex-col p-4 items-start center">
        <h1 className="self-center">Recapitulatif</h1>
        <p>Vous avez choisi de participer a l'événement : {city}</p>
        <p>Adresse du Stade : {address}</p>
        <p>
          Date de l'événement :{" "}
          {new Date(date).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p>Formule Choisie : {title}</p>
        <p>Prix : {price} €</p>
        <div className="flex flex-row gap-2">
          <p>Code Promo : </p> &nbsp;
          <input
            type="text"
            className="rounded"
            value={codePromo}
            onChange={(e) => setCodePromo(e.target.value)}
          />
          <button className="bg-red-600 text-white rounded px-2">
            Utiliser
          </button>
        </div>
      </div>
      <div className="bg-gray-900 shadow rounded-lg p-6 mb-4">
        <div className="mb-4">
          <label
            className="block text-gray-300 text-sm font-medium mb-2"
            htmlFor="card-number"
          >
            Card Number
          </label>
          <div className="border border-gray-300 rounded-md p-2">
            <CardNumberElement
              id="card-number"
              options={CARD_ELEMENT_OPTIONS}
              className="w-full focus:outline-none"
            />
          </div>
        </div>

        <div className="mb-4 flex w-[400px] flex space-x-4 mb-4">
          <div className="w-1/2">
            <label
              className="block text-gray-300 text-sm font-medium mb-2"
              htmlFor="card-expiry"
            >
              Expiry Date
            </label>
            <div className="border border-gray-300 rounded-md p-2">
              <CardExpiryElement
                id="card-expiry"
                options={CARD_ELEMENT_OPTIONS}
                className="w-full focus:outline-none"
              />
            </div>
          </div>

          <div className="w-1/2">
            <label
              className="block text-gray-300 text-sm font-medium mb-2"
              htmlFor="card-cvc"
            >
              CVC
            </label>
            <div className="border border-gray-300 rounded-md p-2">
              <CardCvcElement
                id="card-cvc"
                options={CARD_ELEMENT_OPTIONS}
                className="w-full focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-red-600 text-white rounded px-2 mb-4"
      >
        <button type="submit">
          {!loading ? "Passer Au Paiement" : <Loader />}
        </button>
      </form>
    </>
  );
}
