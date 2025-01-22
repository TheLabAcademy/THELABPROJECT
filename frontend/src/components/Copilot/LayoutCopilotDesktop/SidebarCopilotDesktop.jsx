import { useContext, useState } from "react";
import { FaChartLine, FaCalendarAlt, FaUser } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { MdOutlineSportsSoccer, MdSports } from "react-icons/md";
import { GrScorecard } from "react-icons/gr";
import { RiLockPasswordLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import ChangePasswordModal from "./ChangePasswordModal";

export default function SidebarCopilotDesktop() {
  const { user } = useContext(UserContext);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  function openPasswordModal() {
    setIsPasswordModalOpen(true);
  }

  function closePasswordModal() {
    setIsPasswordModalOpen(false);
  }

  return (
    <div className="border-background-color-second rounded-b-[20px] border-r-2 pr-5 ">
      <div className="border-background-color-second rounded-tl-[20px] ">
        <h1 className="font-primary-font text-center p-4 text-[20px] ">
          THE LAB
        </h1>
      </div>
      <div className="flex flex-col space-y-4 py-4 ml-4 text-[18px]">
        <NavLink to="/copilot" className="flex items-center">
          <FaChartLine className="mr-4" /> COPILOT
        </NavLink>
        <NavLink to="/copilot/copilotprofile" className="flex items-center">
          <FaUser className="mr-4" /> PROFILE
        </NavLink>
        <NavLink to="/copilot/copilotevenements" className="flex items-center ">
          <FaCalendarAlt className="mr-4" /> EVENEMENTS
        </NavLink>
        <NavLink
          to="/copilot/copilot_score_card"
          className="flex items-center "
        >
          <GrScorecard className="mr-4" /> SCORE CARD
        </NavLink>
        <NavLink
          to="/copilot/copilotentrainements"
          className="flex items-center"
        >
          <MdOutlineSportsSoccer className="mr-4" /> ENTRAINEMENT
        </NavLink>
        <NavLink to="/copilot/copilotmissions" className="flex items-center">
          <MdSports className="mr-4" /> MISSIONS
        </NavLink>
        <NavLink to="/copilot/copilotcontact" className="flex items-center">
          <IoMailOutline className="mr-4" /> CONTACT
        </NavLink>
        <button
          onClick={openPasswordModal}
          className="flex items-center text-white hover:text-gray-300"
        >
          <RiLockPasswordLine className="mr-4" /> CHANGER MOT DE PASSE
        </button>
      </div>
      <div className="flex flex-col items-center my-10">
        {user.data.avatar ? (
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/${user.data.avatar}`}
            alt="Photos de profil"
            className="w-24 h-24 rounded-full"
          />
        ) : (
          <img
            src="/user.svg"
            alt="Photos de profil"
            className="w-24 h-24 rounded-full"
          />
        )}
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        // eslint-disable-next-line react/jsx-no-bind
        onRequestClose={closePasswordModal}
      />
    </div>
  );
}
