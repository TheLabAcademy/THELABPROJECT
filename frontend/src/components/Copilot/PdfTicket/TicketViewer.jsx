import React, { useEffect, useState } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import EventTicket from "./EventTicket"; // Le composant du ticket que tu as déjà créé

// eslint-disable-next-line react/prop-types
function TicketViewer({ token, receiptUrl }) {
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utiliser useEffect pour récupérer les informations du ticket via le token
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/stockEvent/bytoken/${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du ticket");
        }

        const data = await response.json();
        if (!data || !data.data) {
          throw new Error("Aucun billet trouvé pour ce token.");
        }

        setTicketData(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [token]);

  if (loading) {
    return <p>Chargement du ticket...</p>;
  }

  if (error) {
    return (
      <div className="text-center mt-4">
        <p className="text-red-500 font-bold">{error}</p>
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4"
          // eslint-disable-next-line no-return-assign
          onClick={() => (window.location.href = "/")}
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  if (!ticketData) {
    return <p className="text-center">Aucun billet trouvé.</p>;
  }

  // Formater la date pour un affichage plus lisible
  const formattedDate = new Date(ticketData.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-4 max-w-full h-auto text-white border-2 border-white rounded-lg border-opacity-50 ">
      <h2 className="text-2xl font-bold mb-4 text-left">
        Votre billet pour {ticketData.city}
      </h2>
      <div className="text-left">
        <p>
          <strong>Date :</strong> {formattedDate}
        </p>
        <p>
          <strong>Adresse :</strong> {ticketData.address}
        </p>
        <p>
          <strong>Nom du titulaire :</strong> {ticketData.firstname}{" "}
          {ticketData.lastname}
        </p>
      </div>

      <div className="text-center inline-flex mt-4  gap-2">
        <PDFDownloadLink
          document={
            <EventTicket
              eventName={ticketData.city}
              eventDate={formattedDate}
              eventLocation={ticketData.address}
              ticketHolder={`${ticketData.firstname} ${ticketData.lastname}`}
              ticketId={ticketData.unique_string}
            />
          }
          fileName={`ticket-${ticketData.city}.pdf`}
        >
          {({ loading: pdfLoading }) => (
            <button
              disabled={pdfLoading}
              className="mt-4 text-md font-bold text-center text-secondary bg-primary focus:outline-none font-semibold
              bg-gradient-to-r from-[#4CACFF] via-[#A070EF] to-[#8E78DA] rounded-xl hover:bg-gradient-to-r hover:from-[#4CACFF] hover:via-[#4CACFF] hover:to-[#4CACFF] ease-in font-secondary-font p-2"
            >
              <p>
                {pdfLoading ? "Génération du PDF..." : "Télécharger le billet"}
              </p>
            </button>
          )}
        </PDFDownloadLink>
        {receiptUrl && (
          <a
            href={receiptUrl}
            rel="noreferrer noopener"
            target="_blank"
            className="mt-4 text-md font-bold text-center text-secondary bg-primary focus:outline-none font-semibold
            bg-gradient-to-r from-[#4CACFF] via-[#A070EF] to-[#8E78DA] rounded-xl hover:bg-gradient-to-r hover:from-[#4CACFF] hover:via-[#4CACFF] hover:to-[#4CACFF] ease-in font-secondary-font p-2"
          >
            <p>Afficher votre reçu</p>
          </a>
        )}
      </div>

      <div className="w-full h-96 mt-4 mb-5">
        <PDFViewer className="w-full h-full">
          <EventTicket
            eventName={ticketData.city}
            eventDate={formattedDate}
            eventLocation={ticketData.address}
            ticketHolder={`${ticketData.firstname} ${ticketData.lastname}`}
            ticketId={ticketData.unique_string}
          />
        </PDFViewer>
      </div>
      <a
        href="/"
        className="mt-10 text-md font-bold text-center text-secondary bg-primary focus:outline-none font-semibold 
           bg-gray-800 rounded-xl hover:bg-gradient-to-r hover:from-[#4CACFF] hover:via-[#4CACFF] hover:to-[#4CACFF] ease-in font-secondary-font p-2"
      >
        Retour à l'accueil
      </a>
    </div>
  );
}

export default TicketViewer;
