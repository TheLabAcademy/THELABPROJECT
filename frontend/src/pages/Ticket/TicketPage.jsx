/* eslint-disable react/prop-types */
import React from "react";
import { useParams } from "react-router-dom";
import TicketViewer from "../../components/Copilot/PdfTicket/TicketViewer";

function TicketPage() {
  const { token } = useParams(); // Utilisation de useParams pour récupérer le token

  return (
    <div className="pdf-preview w-full h-full p-4 md:w-2/4 md:p-9">
      <div className="w-full h-full">
        <TicketViewer token={token} receiptUrl={null} />
      </div>
    </div>
  );
}

export default TicketPage;
