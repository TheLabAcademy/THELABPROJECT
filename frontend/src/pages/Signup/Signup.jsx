import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "react-feather";
import TopMain from "../../components/TopMain/TopMain";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    lastname: "",
    firstname: "",
    birthday: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateMedia = () => {
      setIsMobile(window.innerWidth < 640); // 640px est la taille par défaut pour 'sm'
    };

    window.addEventListener("resize", updateMedia);
    updateMedia(); // Vérifie la taille à l'initialisation

    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "confirmPassword")
      if (e.target.value !== formData.password) {
        setErrorMessage("Vous devez saisir le même mot de passe !");
      } else {
        setErrorMessage("");
      }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
        setTimeout(() => {
          navigate("/login");
          setLoading(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <TopMain title="Inscription" description="Rejoignez-nous" />
      <div className=" xl:w-[700px] mt-8 mb-4 ml-8 mr-8 font-secondary-font">
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleSubmit}
        >
          <div className="relative text-white">
            <input
              type="text"
              id="lastname"
              name="lastname"
              className="input"
              required
              value={formData.lastname}
              onChange={handleChange}
              autoComplete="given-name"
            />
            <label
              htmlFor="lastname"
              className="absolute top-4 left-4 pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-400"
            >
              Nom*
            </label>
          </div>
          <div className="relative text-white">
            <input
              type="firstname"
              id="firstname"
              name="firstname"
              className="input"
              value={formData.firstname}
              onChange={handleChange}
              required
              autoComplete="your-firstname"
            />
            <label
              htmlFor="email"
              className="absolute top-4 left-4 pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-400"
            >
              Prénom*
            </label>
          </div>
          <div className="relative text-white">
            <input
              type="date"
              id="birthday"
              name="birthday"
              className={`input bg-transparent text-white border border-gray-300 p-3 ${
                !formData.birthday && isMobile ? "opacity-0" : "opacity-100"
              }`}
              required
              value={formData.birthday}
              onChange={handleChange}
              autoComplete="birthdate"
            />
            <label
              htmlFor="birthday"
              className="absolute top-4 left-4 pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-400 block lg:hidden"
            >
              {" "}
              {!formData.birthday
                ? "Sélectionnez votre date de naissance en cliquant ici"
                : "Date de naissance*"}
            </label>
          </div>
          <div className="relative text-white">
            <input
              type="email"
              id="email"
              name="email"
              className="input"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="your-email"
            />
            <label
              htmlFor="email"
              className="absolute top-4 left-4 pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-400"
            >
              Email*
            </label>
          </div>
          <div className="relative text-white">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              className="input"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 focus:outline-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <Eye /> : <EyeOff />}
            </button>
            <label
              htmlFor="password"
              className="absolute top-4 left-4 pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-400"
            >
              Mot de passe*
            </label>
          </div>
          <div className="relative text-white">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              className="input"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 focus:outline-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? <Eye /> : <EyeOff />}
            </button>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <label
              htmlFor="password"
              className="absolute top-4 left-4 pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] text-gray-400"
            >
              Confirmation*
            </label>
          </div>
          <div className=" relative flex flex-col  items-center  text-white justify-between">
            <label className="text-white" htmlFor="terms">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                required
                className="mr-2"
              />
              J'accepte les conditions d'utilisation
            </label>
            <button
              type="submit"
              disabled={formData.password !== formData.confirmPassword}
              className="py-3 px-5 text-md font-bold text-center tracking-widest text-secondary bg-primary sm:w-fit focus:outline-none 
            bg-gradient-to-r from-[#4CACFF] via-[#A070EF] to-[#8E78DA] rounded-xl hover:bg-gradient-to-r hover:from-[#4CACFF] hover:via-[#4CACFF] hover:to-[#4CACFF] ease-in font-primary-font md:w-[200px] w-full"
            >
              {loading ? "Patientez..." : "Je M'inscris"}
            </button>
          </div>
          <div className="text-xs">
            <label className="text-white" htmlFor="newsletter">
              <p>
                En vous inscrivant, vous acceptez nos&nbsp;
                <a className="text-primary-color" href="/legal">
                  Conditions générales.
                </a>
                Découvrez comment nous collectons, utilisons et partageons vos
                données en lisant notre&nbsp;
                <a className="text-primary-color" href="/">
                  Politique de confidentialité
                </a>
                &nbsp; et comment nous utilisons les cookies et autres
                technologies similaires en consultant notre&nbsp;
                <a className="text-primary-color" href="/">
                  Politique d’utilisation des cookies.
                </a>
              </p>
            </label>
          </div>
        </form>
      </div>
      <div className="flex justify-center items-center mt-2 mb-28 font-secondary-font">
        <p className="text-white">
          Vous avez déjà un compte ?&nbsp;
          <a
            className="text-primary-color"
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            Connectez-vous
          </a>
        </p>
      </div>
    </div>
  );
}
