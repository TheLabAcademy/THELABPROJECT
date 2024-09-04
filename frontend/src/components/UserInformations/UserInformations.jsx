/* eslint-disable react/self-closing-comp */
/* eslint-disable jsx-a11y/control-has-associated-label */
import PropTypes from "prop-types";
// import { useState } from "react";

export default function UserInformations({
  formUserInfos,
  setFormUserInfos,
  setIsFormValid,
}) {
  const handleUserInfosSubmit = (e) => {
    e.preventDefault();
  };

  const handleUserInfosChange = (e) => {
    setFormUserInfos((prevFormUserInfos) => {
      const updatedFormUserInfos = {
        ...prevFormUserInfos,
        [e.target.name]: e.target.value,
      };
      const isFormValid = Object.values(updatedFormUserInfos).every(
        (value) => value !== "" && value !== null && value !== undefined
      );
      setIsFormValid(isFormValid);
      return updatedFormUserInfos;
    });
  };

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8"
      onSubmit={handleUserInfosSubmit}
    >
      <div className="relative text-white">
        <input
          type="tel"
          id="numero_de_telephone"
          name="numero_de_telephone"
          className="input"
          required
          value={formUserInfos.numero_de_telephone}
          onChange={handleUserInfosChange}
          autoComplete="numero_de_telephone"
          pattern="^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$"
          title="Entrez un numéro de téléphone correct"
        />
        <label
          htmlFor="numero_de_telephone"
          className="absolute top-4 left-4 pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1) ] text-gray-400"
        >
          Téléphone *
        </label>
      </div>
      <div className="relative text-white">
        <input
          type="text"
          id="ville"
          name="ville"
          className="input"
          required
          value={formUserInfos.ville}
          onChange={handleUserInfosChange}
          autoComplete="given-city"
        />
        <label
          htmlFor="ville"
          className="absolute top-4 left-4 pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-400"
        >
          Ville *
        </label>
      </div>
      <div className="relative text-white">
        <input
          type="text"
          id="code_postal"
          name="code_postal"
          className="input"
          required
          value={formUserInfos.code_postal}
          onChange={handleUserInfosChange}
          autoComplete="postal-code"
        />
        <label
          htmlFor="code_postal"
          className="absolute top-4 left-4 pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-400"
        >
          Code Postal *
        </label>
      </div>
      <div className="relative text-white">
        <input
          type="text"
          id="adresse_postale"
          name="adresse_postale"
          className="input"
          required
          value={formUserInfos.adresse_postale}
          onChange={handleUserInfosChange}
          autoComplete="given-address"
        />
        <label
          htmlFor="adresse_postale"
          className="absolute top-4 left-4 pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-400"
        >
          Adresse Postale *
        </label>
      </div>
      <div className="relative text-white">
        <input
          type="text"
          id="taille"
          name="taille"
          required
          className="input"
          value={formUserInfos.taille}
          onChange={handleUserInfosChange}
          autoComplete="taille"
        />
        <label
          htmlFor="taille"
          className="absolute top-4 left-4 pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-400"
        >
          Taille * (en Cm)
        </label>
      </div>
      <div className="relative text-white">
        <input
          type="text"
          id="poids"
          name="poids"
          required
          className="input"
          value={formUserInfos.poids}
          onChange={handleUserInfosChange}
          autoComplete="poids"
        />
        <label
          htmlFor="poids"
          className="absolute top-4 left-4 pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-400"
        >
          Poids * (en Kg)
        </label>
      </div>
      <div className="relative text-white">
        <input
          type="text"
          id="pointure"
          name="pointure"
          required
          className="input"
          value={formUserInfos.pointure}
          onChange={handleUserInfosChange}
          autoComplete="pointure"
        />
        <label
          htmlFor="pointure"
          className="absolute top-4 left-4 pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-400"
        >
          Pointure * (en FR)
        </label>
      </div>
      <div className="relative text-white">
        <select
          id="sexe"
          name="sexe"
          className="input"
          required
          value={formUserInfos.sexe}
          onChange={handleUserInfosChange}
        >
          <option value=""></option>
          <option value="masculin">Homme</option>
          <option value="féminin">Femme</option>
        </select>
        <label
          htmlFor="sexe"
          className="absolute top-4 left-4 pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-400"
        >
          Sexe *
        </label>
      </div>
      <div className="relative text-white">
        <select
          id="poste"
          name="poste"
          className="input"
          required
          value={formUserInfos.poste}
          onChange={handleUserInfosChange}
        >
          <option value=""></option>
          <option value="attaquant">Attaquant</option>
          <option value="milieu">Milieu</option>
          <option value="défenseur">Défenseur</option>
          <option value="gardien">Gardien</option>
        </select>
        <label
          htmlFor="poste"
          className="absolute top-4 left-4 pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-400"
        >
          Poste *
        </label>
      </div>
      <div className="relative text-white">
        <select
          id="pied_fort"
          name="pied_fort"
          className="input"
          required
          value={formUserInfos.pied_fort}
          onChange={handleUserInfosChange}
        >
          <option value=""></option>
          <option value="droit">Droit</option>
          <option value="gauche">Gauche</option>
        </select>
        <label
          htmlFor="pied_fort"
          className="absolute top-4 left-4 pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-400"
        >
          Pied fort *
        </label>
      </div>
      <div className="relative text-white">
        <input
          type="file"
          id="img"
          name="img"
          className="input"
          accept="image/*"
          onChange={handleUserInfosChange}
        />
        <label
          htmlFor="avatar"
          className="absolute top-4 left-4 pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-400"
        >
          Télécharger une photo (avatar)
        </label>
      </div>
    </form>
  );
}

UserInformations.propTypes = {
  formUserInfos: PropTypes.shape({
    taille: PropTypes.number.isRequired,
    poids: PropTypes.number.isRequired,
    pointure: PropTypes.number.isRequired,
    pied_fort: PropTypes.string.isRequired,
    poste: PropTypes.string.isRequired,
    sexe: PropTypes.string.isRequired,
    numero_de_telephone: PropTypes.number.isRequired,
    adresse_postale: PropTypes.string.isRequired,
    ville: PropTypes.string.isRequired,
    code_postal: PropTypes.number.isRequired,
  }).isRequired,
  setFormUserInfos: PropTypes.func.isRequired,
  setIsFormValid: PropTypes.func.isRequired,
};
