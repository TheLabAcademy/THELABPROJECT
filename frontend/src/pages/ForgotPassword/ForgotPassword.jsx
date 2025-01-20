import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopMain from "../../components/TopMain/TopMain";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((res) => {
        console.info("res", res);
        if (res.status === 200) {
          setRequestSuccess(true);
          return res.json().then((data) => {
            setTimeout(() => {
              setErrorMessage(data.message);
            }, 2000);
            setTimeout(() => {
              navigate("/login");
            }, 4000);
          });
        }
        if (res.status === 400) {
          setRequestSuccess(false);
          return res.json().then((data) => {
            throw new Error(data.message);
          });
        }
        return res.json();
      })
      .then((data) => {
        setTimeout(() => {
          setErrorMessage(data.message);
          setLoading(false);
        }, 4000);
      })
      .catch((error) => {
        console.error("Error:", error);
        setRequestSuccess(false);
        setTimeout(() => {
          setErrorMessage(error.message);
          setLoading(false);
        }, 4000);
      });
    console.info("email", email);
  };

  return (
    <>
      <TopMain
        title="Mot de passe oublié"
        description="Récupérez votre mot de passe"
      />
      <div className="xl:w-[700px] mt-8 mb-4 ml-8 mr-8">
        {errorMessage && (
          <p
            className={
              requestSuccess ? "text-green-600 mb-2" : "text-red-600 mb-2"
            }
          >
            {errorMessage}
          </p>
        )}{" "}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="relative text-white">
            <input
              type="text"
              id="email"
              name="email"
              className="input"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              htmlFor="email"
              className="absolute top-4 left-4 pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-400"
            >
              Email
            </label>
          </div>
          <div className="relative text-white">
            <button
              type="submit"
              className="py-3 px-5 text-md font-bold text-center tracking-widest text-secondary bg-primary focus:outline-none 
                bg-gradient-to-r from-[#4CACFF] via-[#A070EF] to-[#8E78DA] rounded-xl hover:bg-gradient-to-r hover:from-[#4CACFF] hover:via-[#4CACFF] hover:to-[#4CACFF] ease-in font-primary-font w-full md:w-[200px]"
              disabled={loading}
            >
              {loading ? "Chargement..." : "Envoyer"}{" "}
            </button>
          </div>
        </form>
      </div>
      <div className="flex flex-col justify-center mb-[200px]">
        <p className="text-white text-center">
          <a
            className="text-primary-color"
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          >
            Retourner à la page de connexion
          </a>
        </p>
      </div>
    </>
  );
}
