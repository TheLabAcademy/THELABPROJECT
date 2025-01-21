/* eslint-disable no-unused-vars */
/* eslint-disable no-return-assign */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useEffect, useRef, useState } from "react";
import videoSources from "./videoDescriptions";

export default function CopilotTrainComponent() {
  const [hoverStates, setHoverStates] = useState([]);

  useEffect(() => {
    // Initialize hover states array based on the number of videos
    setHoverStates(Array(videoSources.length).fill(false));
  }, [videoSources.length]);

  const handleMouseOver = (index) => {
    setHoverStates((prevHoverStates) => {
      const newHoverStates = [...prevHoverStates];
      newHoverStates[index] = true;
      return newHoverStates;
    });
  };

  const handleMouseOut = (index) => {
    setHoverStates((prevHoverStates) => {
      const newHoverStates = [...prevHoverStates];
      newHoverStates[index] = false;
      return newHoverStates;
    });
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center items-center lg:h-auto rounded-[20px] mt-6 md:justify-items-center md:mb-6 mb-6">
      {videoSources.map(({ id, title }) => (
        <div
          key={id}
          className="w-64 h-36 relative bg-gray-200 rounded-[20px] flex items-center justify-center"
          onMouseOver={() => handleMouseOver(id)}
          onMouseOut={() => handleMouseOut(id)}
        >
          {/* Placeholder text instead of video */}
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 text-white text-lg">
            Fonctionnalité bientôt disponible
          </div>
        </div>
      ))}
    </div>
  );
}
