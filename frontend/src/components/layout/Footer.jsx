import { Link } from "react-router-dom";

import React from "react";
import logo from "../../assets/logo.svg";
import wild from "../../assets/wild.svg";
import french from "../../assets/french.svg";
import mail from "../../assets/vector/mail.svg";
import youtube from "../../assets/vector/youtube.svg";
import facebook from "../../assets/vector/facebook.svg";
import instagram from "../../assets/vector/instagram.svg";
import next from "../../assets/vector/next.svg";

function Footer() {
  return (
    <div className="flex bg-background-color-first flex-col gap-5 justify-center border-gray-400">
      <div className="flex gap-5 justify-between  lg:gap-20">
        <div className="flex gap-2 justify-center items-center flex-col lg:gap-5 lg:flex-row w-4/5 lg:w-auto">
          <Link to="/">
            <img
              src={logo}
              alt="logo"
              className="lg:w-60 lg:h-60 h-30 lg:pl-4"
            />
          </Link>
          <div className="flex flex-col flex-wrap text-white gap-5 justify-center">
            <h1 className="font-primary-font text-white text-3xl text-center ">
              THE LAB
            </h1>
            <p className=" lg:block  lg:font-primary-font lg:text-sm text-center hidden">
              STOP DREAMING, START EXCELLING
            </p>
            <p className=" lg:block lg:font-secondary-font text-center hidden">
              Participer à la plus belle aventure football jamais connue
            </p>
          </div>
        </div>
        <div className="lg:flex lg:flex-col lg:gap-10 lg:items-center hidden">
          <h2 className="text-white font-bold font-secondary-font ">
            Navigation
          </h2>
          <div className="flex flex-col gap-6 items-center">
            <Link to="/" className="text-white font-secondary-font">
              Accueil
            </Link>
            <Link to="/about" className="text-white font-secondary-font">
              A propos
            </Link>
            <Link to="/contact" className="text-white font-secondary-font">
              Contact
            </Link>
            <Link to="/workshops" className="text-white font-secondary-font">
              Ateliers
            </Link>
            <Link
              to="/giveaway"
              className="text-white font-secondary-font text-center"
            >
              Jeux Concours
            </Link>
          </div>
        </div>
        <div className="flex flex-col  flex-wrap gap-10 justify-center pr-2">
          <h1 className="text-white text-xl font-bold font-secondary-font">
            Nos partenaires
          </h1>
          <p className="text-white  font-secondary-font max-w-[700px] lg:text-xs">
            Bienvenue dans The Lab, votre destination pour débloquer tout le
            potentiel footballistique. Notre approche innovante associe
            technologie de pointe et coaching d'experts pour identifier et
            développer les talents. Avec nos évaluations précises et nos
            recommandations personnalisées, chaque joueur peut atteindre de
            nouveaux sommets sur le terrain.{" "}
          </p>
          <Link to="/about">
            <div className="flex items-center justify-center">
              <p className=" text-learnMore-color font-secondary-font">
                En savoir plus
              </p>
              <img src={next} alt="next" className="w-8 h-8" />
            </div>
          </Link>
          <div className="flex gap-10 justify-center lg:gap-10 items-center">
            <Link to="https://www.lafrenchtech-stl.com/">
              <img
                src={french}
                alt="french"
                className="h-24 w-24 lg:h-auto lg:w-auto"
              />
            </Link>
            <Link to="https://www.wildcodeschool.com/">
              <img
                src={wild}
                alt="wild"
                className="h-24 w-28 lg:h-auto lg:w-auto"
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-around lg:gap-40 lg:justify-center">
        <Link to="mailto:thelabfr.contact@gmail.com">
          <div className="flex gap-5 items-center">
            <img src={mail} alt="email" className="w-8 h-8" />
            <p className="text-white font-bold underline font-secondary-font">
              thelabfr.contact@gmail.com
            </p>
          </div>
        </Link>
        <div className="flex flex-row gap-5">
          <Link to="https://www.facebook.com/">
            <img src={facebook} alt="facebook" className="w-8 h-8" />
          </Link>
          <Link to="https://www.youtube.com/channel/UCuB2YZGqxAXG1-mxpMyAgbA">
            <img src={youtube} alt="youtube" className="w-8 h-8" />
          </Link>

          <Link to="https://www.instagram.com/thelabsoccer/">
            <img src={instagram} alt="instagram" className="w-8 h-8" />
          </Link>
        </div>
      </div>
      <div className="flex justify-center">
        <p className="text-white font-secondary-font pb-2">
          © 2024 THE LAB • All Rights Reserved
        </p>
      </div>
    </div>
  );
}

export default Footer;
