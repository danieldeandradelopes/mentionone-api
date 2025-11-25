FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install pm2 -g

COPY . .

RUN npm run build

COPY scripts/start.sh .
RUN chmod +x start.sh

CMD ["./start.sh"]