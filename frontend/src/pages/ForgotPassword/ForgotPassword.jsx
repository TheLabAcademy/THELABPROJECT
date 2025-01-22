import { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        "service_z81tqku",
        "template_9se2arf",
        {
          from_email: email,
        },
        "oc3eKWIanydO423xS"
      )
      .then(() => {
        setLoading(false);
        setRequestSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
        setErrorMessage(
          "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer."
        );
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Mot de passe oublié
        </h2>
        {requestSuccess ? (
          <div className="text-green-500 text-center mb-4">
            Votre demande a été envoyée avec succès. Notre équipe vous
            contactera rapidement avec un mot de passe provisoire. Vous allez
            être redirigé vers la page de connexion...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Envoi en cours..." : "Envoyer"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
