/* eslint-disable react/no-array-index-key */
import { useState } from "react";
import { TiTick } from "react-icons/ti";
import { formulas } from "../../data/constants/index";
import Dropdown from "../Dropdown/Dropdown";
import Formules from "../Formules/Formules";
import UserInformations from "../UserInformations/UserInformations";
import "./stepper.css";
import Recapitulatif from "../Recapitulatif/Recapitulatif";

export default function Stepper() {
  const steps = ["Evenement", "Formule", "Information", "Paiement"];
  const [currentStep, setcurrentStep] = useState(1);
  const [complete, setcomplete] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({
    id: "",
    address: "",
    city: "",
    date: "",
  });
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formUserInfos, setFormUserInfos] = useState({
    taille: "",
    poids: "",
    pointure: "",
    pied_fort: "",
    poste: "",
    sexe: "",
    numero_de_telephone: "",
    adresse_postale: "",
    ville: "",
    code_postal: "",
    img: "",
  });
  console.info("isFormValid from Stepper", isFormValid);
  console.info("formUserInfos from Stepper", formUserInfos);
  return (
    <>
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`step-item ${currentStep === index + 1 && "active"} ${
              (index + 1 < currentStep || complete) && "complete"
            }`}
          >
            <div className="step">
              <span className="text-white text-sm">
                {index + 1 < currentStep || complete ? (
                  <TiTick size={24} />
                ) : (
                  index + 1
                )}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-500">{step}</span>
          </div>
        ))}
      </div>
      {currentStep < 4 && (
        <button
          className="mt-4 text-md font-bold text-center text-secondary bg-primary focus:outline-none 
            bg-gradient-to-r from-[#4CACFF] via-[#A070EF] to-[#8E78DA] rounded-xl hover:bg-gradient-to-r hover:from-[#4CACFF] hover:via-[#4CACFF] hover:to-[#4CACFF] ease-in font-primary-font p-2"
          // disabled={
          //   (currentStep === 1 && !selectedEvent) ||
          //   (currentStep === 2 && !selectedFormula) ||
          //   (currentStep === 3 && !isFormValid)
          // }
          onClick={() => {
            if (currentStep === steps.length) {
              setcomplete(true);
            } else {
              setcurrentStep((prev) => prev + 1);
            }
          }}
        >
          {currentStep === steps.length ? "Terminer" : "Etape Suivante"}
        </button>
      )}
      {currentStep === 1 && (
        <Dropdown
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />
      )}
      {currentStep === 2 && (
        <Formules formulas={formulas} setSelectedFormula={setSelectedFormula} />
      )}
      {currentStep === 3 && (
        <UserInformations
          formUserInfos={formUserInfos}
          setFormUserInfos={setFormUserInfos}
          setIsFormValid={setIsFormValid}
        />
      )}
      {currentStep === 4 && (
        <Recapitulatif
          selectedFormula={selectedFormula}
          selectedEvent={selectedEvent}
          formUserInfos={formUserInfos}
          ifEventCreated={(finish) => setcomplete(finish)}
        />
      )}
    </>
  );
}
