/* eslint-disable no-shadow */
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";

export default function CopilotQR() {
  const [qrData, setQRData] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stockEvent/user`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // ligne pour vérifier les données
        if (data && data.length > 0) {
          const ticketLink = `${import.meta.env.VITE_FRONTEND_URL}/ticket/${data[0].token}`;
          setQRData(ticketLink);
        } else {
          setQRData("No ticket found");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setQRData("No ticket found");
      });
  }, []);

  if (!qrData) {
    return <p>Chargement ...</p>;
  }

  if (qrData === "No ticket found") {
    return <p>Aucun ticket trouvé</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-primary-font">Mon ticket</h2>
      <p>Presentez-le le jour de l'événement</p>
      <div className="bg-white p-5">
        <QRCode value={qrData} />
      </div>
    </div>
  );
}
