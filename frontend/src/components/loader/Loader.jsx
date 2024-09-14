import React from "react";

function Loader() {
  return (
    <div className="loadingAnim" style={{ width: "50px" }}>
      <svg
        id="L4"
        xmlns="http://www.w3.org/2000/svg"
        // eslint-disable-next-line react/no-unknown-property
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        xmlSpace="preserve"
        fill="white"
      >
        <circle stroke="none" cx="25" cy="50" r="6">
          <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.1"
          />
        </circle>
        <circle stroke="none" cx="50" cy="50" r="6">
          <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.2"
          />
        </circle>
        <circle stroke="none" cx="75" cy="50" r="6">
          <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.3"
          />
        </circle>
      </svg>
    </div>
  );
}

export default Loader;
