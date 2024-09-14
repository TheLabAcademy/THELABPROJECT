/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from "react";
import Modal from "react-modal";
import { ImCross } from "react-icons/im";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";

Modal.setAppElement("#root"); // This line is needed for accessibility reasons

export default function EditUserModal({
  isOpen,
  onRequestClose,
  userData,
  notification,
  setNotification,
}) {
  const [formData, setFormData] = useState(userData[0]);

  const showNotification = (message, success) => {
    setNotification({ message, success });

    setTimeout(() => {
      setNotification({ message: "", success: false });
    }, 1000);
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "img") {
      if (files === null) {
        const file = `${import.meta.env.VITE_BACKEND_URL}/${formData[0].avatar}`;
        console.info("file", file);
        setFormData((prevFormData) => ({
          ...prevFormData,
        }));
      } else {
        const file = files[0];
        console.info("file", file);
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: file,
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const updateUserInfo = (updatedUserInfo) => {
    console.info("updatedUserInfo", updatedUserInfo);
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/info`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: formDataToSend,
    })
      .then((response) => response.json())
      .then((data) => {
        console.info("Success:", data);
        showNotification("Profil mis à jour avec succès", true);
        setFormData(updatedUserInfo);
      })
      .catch((error) => {
        showNotification("Erreur lors de la mise à jour du profil", false);
        console.error("Error:", error);
      });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    updateUserInfo(formData);
    setTimeout(() => {
      onRequestClose();
    }, 1000);
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
      <h2 className=" font-bold mb-4 text-2xl">Modifier vos informations :</h2>
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
            onChange={handleChange}
            className="w-80 text-black rounded-lg p-2"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p>Ville :</p>
          <input
            type="text"
            name="ville"
            value={formData.ville}
            onChange={handleChange}
            className="w-80 text-black rounded-lg p-2"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p>Adresse postale :</p>
          <input
            type="text"
            name="adresse_postale"
            value={formData.adresse_postale}
            onChange={handleChange}
            className="w-80 text-black rounded-lg p-2"
          />
        </div>
        <span className="flex flex-col items-center gap-2">
          <p>Sexe :</p>
          <select
            name="sexe"
            className="w-80 h-[28px] rounded-lg text-background-color-second"
            onChange={handleChange}
          >
            <option value={formData.sexe}>Changer de sexe</option>
            <option value="masculin">Masculin</option>
            <option value="féminin">Féminin</option>
          </select>
        </span>
        <div className="flex flex-col items-center gap-2">
          <p>Taille :</p>
          <input
            type="text"
            name="taille"
            value={formData.taille}
            onChange={handleChange}
            className="w-80 text-black rounded-lg p-2"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p>Poids :</p>
          <input
            type="text"
            name="poids"
            value={formData.poids}
            onChange={handleChange}
            className="w-80 text-black rounded-lg p-2"
          />
        </div>
        {/* <div className="flex flex-col items-center gap-2">
          <p>Poste</p>
          <input
            type="text"
            name="poste"
            value={formData.poste}
            onChange={handleChange}
            className="w-80 text-black rounded-lg p-2"
          />
        </div> */}
        <span className="flex flex-col items-center gap-2">
          <p>Poste :</p>
          <select
            name="poste"
            className="w-80 h-[28px] rounded-lg text-background-color-second"
            onChange={handleChange}
          >
            <option value={formData.poste}>Changer de poste</option>
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
          >
            <option value={formData.pied_fort}>Changer de pied fort</option>
            <option value="gauche">Gauche</option>
            <option value="droit">Droite</option>
          </select>
        </span>
        {/* <div className="flex flex-col items-center gap-2">
          <p>Pied fort</p>
          <input
            type="text"
            name="pied_fort"
            value={formData.pied_fort}
            onChange={handleChange}
            className="w-80 text-black rounded-lg p-2"
          />
        </div> */}
        <div className="flex flex-col items-center gap-2">
          <p>Pointure</p>
          <input
            type="text"
            name="pointure"
            value={formData.pointure}
            onChange={handleChange}
            className="w-80 text-black rounded-lg p-2"
          />
        </div>
        <input
          type="file"
          name="img"
          // value={`${import.meta.env.VITE_BACKEND_URL}/${formData.img}`}
          onChange={handleChange}
          className="w-[200px] p-2 rounded-lg text-sm text-white"
        />
        {/* <div className="flex flex-col items-center gap-2">
          <p>Avatar :</p>
          {formData.avatar ? (
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/${formData.avatar}`}
              alt="Photos de profil"
              // onChange={handleSearchChange}
              className="w-20 h-20 rounded-full"
            />
          ) : (
            <img
              src="/user.svg"
              alt="Photos de profil"
              // onChange={handleSearchChange}
              className="w-20 h-20 rounded-full"
            />
          )}
        </div> */}
        <button
          type="submit"
          className="bg-[#544b5d] hover:bg-gray-300 w-[90px] h-[30px] text-base rounded-lg text-white"
        >
          Enregistrer
        </button>
      </form>
      {notification.message && (
        <div
          data-aos="fade-right"
          data-aos-duration="3500"
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
