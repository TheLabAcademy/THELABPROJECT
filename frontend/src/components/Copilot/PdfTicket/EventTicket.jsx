/* eslint-disable react/prop-types */
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import logo from "../../../assets/logo_png.png";

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 50,
  },
  header: {
    backgroundColor: "#004aad",
    padding: 10,
    textAlign: "center",
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    color: "white",
    fontSize: 12,
  },
  section: {
    marginBottom: 15,
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 6,
    backgroundColor: "#f7f7f7",
  },
  label: {
    fontSize: 12,
    color: "#004aad",
    marginBottom: 4,
    fontWeight: "bold",
  },
  text: {
    fontSize: 15,
    marginBottom: 6,
  },
  footer: {
    marginTop: 20,
    padding: 10,
    textAlign: "center",
    color: "#aaa",
    fontSize: 10,
  },
  separator: {
    borderBottom: "1px solid #ddd",
    marginVertical: 15,
  },
  qrCode: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 10,
  },
  logosec: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    textAlign: "center",
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
  },
  logo: {
    width: 100,
    height: 100,
  },
});

// Composant du ticket
function EventTicket({
  eventName,
  eventDate,
  eventLocation,
  ticketHolder,
  ticketId,
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>The Lab: {eventName}</Text>
          <Text style={styles.subtitle}>
            Votre accès officiel à l'événement
          </Text>
        </View>

        {/* Informations sur le ticket */}
        <View style={styles.section}>
          <Text style={styles.label}>Nom du Participant</Text>
          <Text style={styles.text}>{ticketHolder}</Text>

          <View style={styles.separator} />

          <Text style={styles.label}>Date de l'événement</Text>
          <Text style={styles.text}>
            {new Date(eventDate).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
          <View style={styles.separator} />

          <Text style={styles.label}>Lieu</Text>
          <Text style={styles.text}>{eventLocation}</Text>
        </View>

        {/* QR Code ou code unique */}
        <View style={styles.section}>
          <Text style={styles.label}>Code du Ticket</Text>
          <Text style={styles.text}>{ticketId} </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Merci pour votre inscription à {eventName}. Veuillez présenter ce
            ticket à l'entrée.
          </Text>
          <Text>Contactez-nous à support@thelab.com en cas de questions.</Text>
        </View>

        <View style={styles.logosec}>
          <Image style={styles.logo} src={logo} alt="Logo" />
        </View>
      </Page>
    </Document>
  );
}

export default EventTicket;
