/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from "react";
import { LuMapPin } from "react-icons/lu";
import { MdOutlineDateRange } from "react-icons/md";
import { CiMapPin } from "react-icons/ci";
import { IoTicketOutline } from "react-icons/io5";
import Button from "../Button/Button";

const buttonStyles = {
  futures:
    "bg-gradient-to-r leading-none flex justify-center py-2 px-8 lg:w-[230px] lg:h-12 md:w-[200px] md:h-10 text-[15px] md:text-[18px] lg:text-[24px] font-bold from-[#4CACFF] via-[#A070EF] to-[#8E78DA] text-white  flex items-center rounded-[20px] hover:bg-gradient-to-r hover:from-[#4CACFF] hover:via-[#4CACFF] hover:to-[#4CACFF]  ease-in",
  passes:
    "bg-gradient-to-r leading-none flex justify-center py-2 px-8 lg:w-[230px] lg:h-12 md:w-[200px] md:h-10 text-[15px] md:text-[18px] lg:text-[24px] font-bold from-[#F5ABF1] via-[#B980F8] to-[#7651FF] text-white  flex items-center rounded-[20px] hover:bg-gradient-to-r hover:from-[#F5ABF1] hover:via-[#F5ABF1] hover:to-[#F5ABF1]  ease-in",
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [selectTab, setSelectTab] = useState("active");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events`)
      .then((response) => response.json())
      .then((data) => {
        const filtered = data
          .filter((event) => event.status === selectTab)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);
        setEvents(filtered);
      })
      .catch((error) => console.error("Error:", error));
  }, [selectTab]);

  return (
    <div className=" font-secondary-font mt-10">
      <h2 className="font-secondary-font text-white font-[600] text-center text-[25px] md:text-[50px] mt-10">
        EVENEMENTS
      </h2>

      <div className=" flex mt-10 items-center justify-center gap-6 mb-4 text-center ">
        <Button
          type="button"
          content="Futures"
          handleClick={() => setSelectTab("active")}
          className={buttonStyles.futures}
        />
        <Button
          type="button"
          content="Passés"
          handleClick={() => setSelectTab("inactive")}
          className={buttonStyles.passes}
        />
      </div>

      <div
        data-aos="fade-up"
        data-aos-duration="3000"
        className="text-white  flex flex-col justify-center items-center font-secondary-font text-[16px] md:text-[20px] "
      >
        {events.map((event, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className="md:grid md:items-center text-center md:text-start border border-white font-[100] bg-[#4D3E5C] cursor-pointer ease-in duration-100 p-5 rounded-[20px] m-1  md:w-[500px] w-[270px] "
          >
            <h3>
              <LuMapPin className="inline-block " /> {event.city}
            </h3>
            <p>
              <MdOutlineDateRange className="inline-block" />{" "}
              <span className="font-primary-font  font-bold bg-clip-text text-transparent  bg-gradient-to-b from-gradient-color1 via-gradient-color3 to-gradient-color2">
                {new Date(event.date).toLocaleDateString("fr-FR")}
              </span>
            </p>
            <p>
              <CiMapPin className="inline-block " /> {event.address}
            </p>
            <p className="md:flex md:justify-end md:gap-2">
              <IoTicketOutline className="inline-block " /> Il reste{" "}
              <span className="font-primary-font font-bold text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-b from-gradient-color1 via-gradient-color3 to-gradient-color2 animate-bounce">
                {" "}
                {event.quantity}
              </span>{" "}
              places
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
