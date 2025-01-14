import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Stepper from "../../components/Stepper/Stepper";
import TopMain from "../../components/TopMain/TopMain";

export default function Participate() {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE);
  console.info("stripePromise", import.meta.env.VITE_STRIPE);

  return (
    <>
      <TopMain
        title="Prêt à relever le défi ? "
        description="Alors inscris toi !"
      />
      <Elements stripe={stripePromise}>
        <Stepper />
      </Elements>
    </>
  );
}
