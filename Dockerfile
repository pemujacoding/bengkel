FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY backend/ .

EXPOSE 5000

CMD ["node", "-r", "dotenv/config", "app.js"]