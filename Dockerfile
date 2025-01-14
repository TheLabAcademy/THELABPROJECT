# Étape 1 : Construction du frontend
FROM node:16 AS frontend-build

WORKDIR /usr/src/app/frontend

# Copier les fichiers du frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./

# Définir les arguments de build
ARG VITE_BACKEND_URL
ARG VITE_STRIPE
ARG VITE_FRONTEND_URL
ARG VITE_OFFER_BASIC_STRIPE
ARG VITE_OFFER_PREMIUM_STRIPE

ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_STRIPE=${VITE_STRIPE}
ENV VITE_FRONTEND_URL=${VITE_FRONTEND_URL}
ENV VITE_OFFER_BASIC_STRIPE=${VITE_OFFER_BASIC_STRIPE}
ENV VITE_OFFER_PREMIUM_STRIPE=${VITE_OFFER_PREMIUM_STRIPE}

# Construire le frontend
RUN npm run build

# Étape 2 : Construction du backend
FROM node:16

WORKDIR /usr/src/app

# Copier les fichiers du backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./

# Copier les fichiers construits du frontend dans le backend
COPY --from=frontend-build /usr/src/app/frontend/dist ./public

# Exposer le port de l'application
EXPOSE 3310

# Démarrer l'application
CMD ["node", "src/app.js"]
