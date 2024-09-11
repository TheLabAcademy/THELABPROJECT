/* eslint-disable react/prop-types */
import React from "react";
import { useParams } from "react-router-dom";
import TicketViewer from "../../components/Copilot/PdfTicket/TicketViewer";

function TicketPage() {
  const { token } = useParams(); // Utilisation de useParams pour récupérer le token

  return (
    <div className="pdf-preview w-2/4 p-9  ">
      <div className="w-100% h-100% ">
        <TicketViewer token={token} />
      </div>
    </div>
  );
}

export default TicketPage;
