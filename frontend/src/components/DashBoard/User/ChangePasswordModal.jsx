import { useState } from "react";
import Modal from "react-modal";

// eslint-disable-next-line react/prop-types
export default function ChangePasswordModal({ isOpen, onRequestClose }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "confirmPassword") {
      if (e.target.value !== formData.newPassword) {
        setErrorMessage("Les mots de passe ne correspondent pas");
      } else {
        setErrorMessage(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            hashedPassword: formData.newPassword,
          }),
        }
      );

      if (response.ok) {
        setSuccessMessage("Mot de passe modifié avec succès");
        setTimeout(() => {
          onRequestClose();
        }, 2000);
      } else {
        const data = await response.json();
        setErrorMessage(
          data.message || "Erreur lors de la modification du mot de passe"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Erreur lors de la modification du mot de passe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background-color-second p-8 rounded-lg shadow-md w-96"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        Modifier mon mot de passe
      </h2>
      {successMessage ? (
        <div className="text-green-500 text-center mb-4">{successMessage}</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-white mb-2"
            >
              Mot de passe actuel
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-white mb-2"
            >
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white mb-2"
            >
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {errorMessage && (
            <div className="text-red-500 text-sm">{errorMessage}</div>
          )}
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={onRequestClose}
              className="w-1/2 bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Modification..." : "Modifier"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
