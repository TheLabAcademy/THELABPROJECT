/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Modal from "react-modal";
import { ImCross } from "react-icons/im";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";

Modal.setAppElement("#root"); // This line is needed for accessibility reasons

export default function AddProfileCopilotModal({
  isOpen,
  onRequestClose,
  notification,
  setNotification,
}) {
  const [formData, setFormData] = useState({
    numero_de_telephone: "",
    ville: "",
    adresse_postale: "",
    sexe: "",
    taille: "",
    poids: "",
    poste: "",
    pied_fort: "",
    pointure: "",
    img: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const file = name === "img" ? files[0] : null;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "img" ? file : value,
    }));
  };

  const showNotification = (message, success) => {
    setNotification({ message, success });

    setTimeout(() => {
      setNotification({ message: "", success: false });
    }, 1000);
  };

  console.info("formData", formData);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.info("formData", formData);
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    console.info("formDataToSend", formDataToSend);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/info`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: formDataToSend,
    })
      .then((response) => response.json())
      .then((data) => {
        console.info("Success:", data);
        showNotification("Profile créer avec succès", true);
        setTimeout(() => {
          onRequestClose();
        }, 1000);
      })
      .catch((error) => {
        showNotification("Erreur lors de la création de votre profil", false);
        console.error("Error:", error);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Modifier mes informations"
      className="absolute top-1/2 left-1/2 right-auto h-auto  lg:h-[98%] bottom-auto mr-[-50%] transform -translate-x-1/2 -translate-y-1/2 md:w-[25rem] lg:w-[40rem] text-[8px] text-center bg-[#281f31] text-white p-4 rounded-lg font-secondary-font"
    >
      <button className="flex " onClick={onRequestClose}>
        <ImCross />
      </button>
      <h2 className=" font-bold mb-4 text-2xl">Saisir vos informations :</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-between items-center gap-2 text-white"
      >
        <div className="flex flex-col items-center gap-2 ">
          <p> Numéro de téléphone :</p>
          <input
            type="text"
            name="numero_de_telephone"
            value={formData.numero_de_telephone}
            placeholder="Numéro de téléphone"
            onChange={handleChange}
            className="w-80 text-black rounded-lg p-2"
            required
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p>Ville :</p>
          <input
            type="text"
            name="ville"
            value={formData.ville}
            placeholder="Ville"
            onChange={handleChange}
            className="w-80 text-black rounded-lg p-2"
            required
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p>Adresse postale :</p>
          <input
            type="text"
            name="adresse_postale"
            value={formData.adresse_postale}
            placeholder="Adresse postale"
            onChange={handleChange}
            className="w-80 text-black rounded-lg p-2"
            required
          />
        </div>
        <span className="flex flex-col items-center gap-2">
          <p>Sexe :</p>
          <select
            name="sexe"
            className="w-80 h-[28px] rounded-lg text-background-color-second"
            onChange={handleChange}
            required
          >
            <option>Saisir votre sexe</option>
            <option value="masculin">Masculin</option>
            <option value="féminin">Féminin</option>
          </select>
        </span>
        <div className="flex flex-col items-center gap-2">
          <p>Taille :</p>
          <input
            type="number"
            name="taille"
            value={formData.taille}
            placeholder="Taille (en cm)"
            onChange={handleChange}
            className="w-80 text-black rounded-lg p-2"
            required
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p>Poids :</p>
          <input
            type="number"
            name="poids"
            value={formData.poids}
            placeholder="Poids"
            onChange={handleChange}
            className="w-80 text-black rounded-lg p-2"
            required
          />
        </div>
        <span className="flex flex-col items-center gap-2">
          <p>Poste :</p>
          <select
            name="poste"
            className="w-80 h-[28px] rounded-lg text-background-color-second"
            onChange={handleChange}
            required
          >
            <option>Saisir votre poste</option>
            <option value="gardien">Gardien</option>
            <option value="défenseur">Défenseur</option>
            <option value="milieu">Milieu</option>
            <option value="attaquant">Attaquant</option>
          </select>
        </span>
        <span className="flex flex-col items-center gap-2">
          <p>Pied fort :</p>
          <select
            name="pied_fort"
            className="w-80 h-[28px] rounded-lg text-background-color-second"
            onChange={handleChange}
            required
          >
            <option>Saisir le pied fort</option>
            <option value="gauche">Gauche</option>
            <option value="droit">Droite</option>
          </select>
        </span>
        <div className="flex flex-col items-center gap-2">
          <p>Pointure</p>
          <input
            type="number"
            name="pointure"
            value={formData.pointure}
            placeholder="Pointure"
            onChange={handleChange}
            className="w-80 text-black rounded-lg p-2"
            required
          />
        </div>
        <input
          type="file"
          name="img"
          onChange={handleChange}
          className="w-[200px] p-2 rounded-lg text-sm text-white"
          required
        />
        <button
          type="submit"
          className="bg-[#544b5d] hover:bg-gray-300 w-[90px] h-[30px] text-base rounded-lg text-white"
        >
          Enregistrer
        </button>
      </form>
      {notification.message && (
        <div
          className={`fixed bottom-4 right-4 px-5 sm:px-5 py-2 rounded-lg flex items-center ${
            notification.success ? "bg-green-500" : "bg-red-500"
          } text-white text-sm`}
        >
          {notification.success ? (
            <IoCheckmarkDoneCircle className="mr-2" />
          ) : (
            <MdErrorOutline className="mr-2" />
          )}
          {notification.message}
        </div>
      )}
    </Modal>
  );
}
