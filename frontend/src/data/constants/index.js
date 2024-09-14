import aleksandra from "../../assets/image/aleksandra.jpg";
import nadir from "../../assets/image/nadir.jpg";
import aurelien from "../../assets/image/aurelien.jpg";
import nicolas from "../../assets/image/nico.jpg";

export const questions = [
  {
    id: 1,
    question:
      "Faut-il fournir des documents spécifiques le jour où l’on se présente à l’événement ? ",
    answer:
      "Une carte d’identité et un certificat médical seront requis pour participer à l’événement.",
  },
  {
    id: 2,
    question: "Quel est le nombre de participants maximum ?",
    answer: "Le nombre de participants maximum est de 50 personnes. ",
  },
  {
    id: 3,
    question: "Est-ce que je peux annuler ma participation ?",
    answer:
      "Oui, vous pouvez annuler votre participation jusqu’à 24 heures avant l’événement. ",
  },
  {
    id: 4,
    question:
      "Est-ce que je peux me faire rembourser si je ne peux pas participer à l’événement ?",
    answer:
      "Oui, vous pouvez vous faire rembourser jusqu’à 24 heures avant l’événement. ",
  },
  {
    id: 5,
    question: "Est-ce que je peux participer à plusieurs ateliers ?",
    answer: "Oui, vous pouvez participer à plusieurs ateliers. ",
  },
  {
    id: 6,
    question: "Est-ce que je peux participer à un atelier sans être inscrit ?",
    answer: "Non, vous devez être inscrit pour participer à un atelier. ",
  },
];

export const services = [
  {
    title: "Nadir, CEO / développeur Fullstack",
    picture: nadir,
    Portfolio: "https://asitouze.github.io/Portefolio/",
  },
  {
    title: "Aleksandra, développeuse Fullstack",
    picture: aleksandra,
    Portfolio: "https://my-portfolio-fawn-kappa-27.vercel.app/",
  },
  {
    title: "Aurélien, développeur Fullstack",
    picture: aurelien,
    Portfolio: "https://asitouze.github.io/Portefolio/",
  },
  {
    title: "Nicolas, développeur Fullstack",
    picture: nicolas,
    Portfolio: "https://lcdp69.github.io/portfolio/",
  },
];

export const formulas = [
  {
    id: 1,
    title: "Basic",
    stripeId: import.meta.env.VITE_OFFER_BASIC_STRIPE, // ID du prix sur Stripe
    description: [
      "Accès à l'événement",
      "ScoreCard numérique personnalisée",
      "Accès à l'application TheLab pour suivre votre progression",
    ],
    price: 89,
  },
  {
    id: 2,
    title: "Premium",
    stripeId: import.meta.env.VITE_OFFER_PREMIUM_STRIPE, // ID du prix sur Stripe
    description: [
      "Accès à l'événement",
      "ScoreCard numérique personnalisée",
      "Accès à l'application TheLab pour suivre votre progression",
      "Paire de crampons personnalisée",
      "Participation au jeux concours",
    ],
    price: 149,
  },
];
