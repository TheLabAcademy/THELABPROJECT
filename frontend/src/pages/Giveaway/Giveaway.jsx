import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/Button/Button";

import Event1 from "../../components/event/Event1";
import { UserContext } from "../../context/UserContext";
// import reglement from "../../data/Reglement.json";

export default function Giveaway() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleClick = () => {
    if (user.isLogged) {
      if (user.data.is_admin === "user") {
        navigate("/copilot/participate");
      } else {
        navigate("/");
      }
    } else {
      navigate("/login");
    }
  };
  const buttonLogin =
    "bg-gradient-to-l leading-none py-2 px-2 from-[#4CACFF] via-[#A070EF] to-[#8E78DA] text-white font-[400] text-[10px] w-[300px] h-[65px] flex items-center justify-center rounded-[20px] hover:bg-gradient-to-l hover:from-[#4CACFF] hover:via-[#4CACFF] hover:to-[#4CACFF] text-[40px] ease-in ";
  return (
    <div className=" z-10 flex flex-col gap-10 pb-28 pt-10">
      <div className="flex flex-col justify-center items-center gap-20 flex-wrap ">
        <h1 className="text-7xl font-secondary-font text-center  bg-gradient-to-t from-gradient-color2  via-gradient-color3 to-gradient-color1 text-transparent bg-clip-text font-bold ">
          Participer au jeu concours
        </h1>
        <Button
          type="button"
          content="Participer"
          handleClick={handleClick}
          className={buttonLogin}
        />
      </div>
      <div className="flex flex-col ml-10 mr-10 gap-5 pt-5">
        <Event1 />
        <div className="flex flex-col justify-center md:items-center gap-5">
          <h2 className=" text-white font-secondary-font font-bold text-center text-2xl">
            REGLEMENT
          </h2>
          <div className="bg-gray-800 p-5 border-white border-2">
            <p className="text-gray-300 font-secondary-font text-left scrollbar md:scrollbar-thumb-black md:scrollbar-track-white  scrollbar-track-transparent h-80 overflow-y-scroll ">
              {/* {reglement} */}
              <section className="mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Article 1 : Organisation
                </h2>
                <p className="mt-2 text-gray-300">
                  Le présent jeu concours est organisé par{" "}
                  <span className="font-bold">THELAB</span>, une start-up
                  spécialisée dans l’évaluation des jeunes talents dans le
                  football. Le jeu concours se déroulera dans les 10 plus
                  grandes villes de France, avec un total de 10 000 places
                  disponibles, soit 1 000 participants par ville.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Article 2 : Conditions de participation
                </h2>

                <h3 className="mt-4 text-lg font-semibold text-white">
                  2.1. Conditions générales
                </h3>
                <ul className="list-disc ml-6 mt-2 text-gray-300">
                  <li>
                    L’âge minimum requis pour participer est de 13 ans à la date
                    de l'inscription.
                  </li>
                  <li>
                    Les participants doivent disposer de l'autorisation de leur
                    représentant légal s’ils sont mineurs.
                  </li>
                  <li>
                    L'inscription au jeu concours est conditionnée à la
                    souscription à la formule premium de THELAB.
                  </li>
                  <li>
                    Chaque participant doit fournir des informations
                    personnelles exactes lors de son inscription.
                  </li>
                </ul>

                <h3 className="mt-4 text-lg font-semibold text-white">
                  2.2. Exclusions
                </h3>
                <ul className="list-disc ml-6 mt-2 text-gray-300">
                  <li>
                    Toute participation effectuée avec des informations erronées
                    ou falsifiées entraînera l’annulation automatique de ladite
                    participation.
                  </li>
                  <li>
                    Les employés de THELAB, leurs proches ainsi que les
                    partenaires directs de l’organisation sont exclus de ce
                    concours.
                  </li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Article 3 : Déroulement du concours
                </h2>

                <h3 className="mt-4 text-lg font-semibold text-white">
                  3.1. Première étape : Journée initiale par ville
                </h3>
                <ul className="list-disc ml-6 mt-2 text-gray-300">
                  <li>
                    Le jeu concours débute avec une phase de tests dans chacune
                    des 10 villes participantes.
                  </li>
                  <li>Chaque ville accueille 1 000 participants maximum.</li>
                  <li>
                    Les participants seront évalués sur les différents ateliers
                    organisés par THELAB, selon des critères précis et
                    standardisés.
                  </li>
                  <li>
                    Les 100 meilleurs joueurs par ville seront sélectionnés pour
                    une deuxième journée de tests.
                  </li>
                </ul>

                <h3 className="mt-4 text-lg font-semibold text-white">
                  3.2. Deuxième étape : Journée de confrontation
                </h3>
                <ul className="list-disc ml-6 mt-2 text-gray-300">
                  <li>
                    Les 100 sélectionnés de chaque ville participeront à une
                    confrontation où leurs performances seront évaluées sur la
                    base d'un barème spécifique.
                  </li>
                  <li>
                    Les 30 meilleurs joueurs de chaque ville seront sélectionnés
                    pour représenter leur ville au tournoi national.
                  </li>
                </ul>

                <h3 className="mt-4 text-lg font-semibold text-white">
                  3.3. Finale nationale
                </h3>
                <ul className="list-disc ml-6 mt-2 text-gray-300">
                  <li>
                    Les 30 meilleurs joueurs de chaque ville (soit 300
                    participants au total) participeront à un tournoi national.
                  </li>
                  <li>
                    Les 30 meilleurs joueurs au niveau national seront
                    sélectionnés pour remporter le grand prix.
                  </li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Article 4 : Parité et sélection finale
                </h2>
                <p className="mt-2 text-gray-300">
                  THELAB s’engage à promouvoir la parité et à encourager une
                  participation égale entre filles et garçons. Les 30 gagnants
                  nationaux seront composés de 15 filles et 15 garçons, sur la
                  base des meilleures performances.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Article 5 : Dotation
                </h2>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  5.1. Prix principal
                </h3>
                <p className="mt-2 text-gray-300">
                  Les 30 gagnants remporteront un voyage de 3 semaines aux
                  États-Unis, entièrement pris en charge par THELAB. Le voyage
                  inclura des activités sportives, des entraînements
                  footballistiques encadrés par le staff de THELAB et des
                  opportunités de développement personnel.
                </p>

                <h3 className="mt-4 text-lg font-semibold text-white">
                  5.2. Conditions de remise du prix
                </h3>
                <ul className="list-disc ml-6 mt-2 text-gray-300">
                  <li>
                    Le prix sera attribué uniquement aux joueurs sans
                    contraintes légales ou administratives pour voyager à
                    l’étranger.
                  </li>
                  <li>
                    En cas d’impossibilité de se rendre aux États-Unis, le
                    gagnant perdra son prix sans possibilité de compensation.
                  </li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Article 6 : Calendrier et communication
                </h2>
                <p className="mt-2 text-gray-300">
                  Toutes les dates (journées de tests, finales, voyage) seront
                  annoncées sur le site officiel de THELAB et sur ses réseaux
                  sociaux au moins 1 mois à l'avance. THELAB se réserve le droit
                  de modifier le calendrier en cas de force majeure (article
                  1218 du Code civil).
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Article 7 : Responsabilité
                </h2>
                <p className="mt-2 text-gray-300">
                  THELAB ne peut être tenu responsable des problèmes techniques,
                  interruptions de service, ou annulations dues à des
                  circonstances indépendantes de sa volonté. Les participants
                  sont responsables de leur propre équipement (tenue de sport,
                  chaussures).
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Article 8 : Données personnelles
                </h2>
                <p className="mt-2 text-gray-300">
                  Conformément à la loi « Informatique et Libertés » du 6
                  janvier 1978 modifiée et au RGPD, les données collectées dans
                  le cadre de ce concours seront utilisées uniquement pour sa
                  bonne organisation et ne seront pas transmises à des tiers
                  sans consentement préalable.
                </p>
              </section>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
