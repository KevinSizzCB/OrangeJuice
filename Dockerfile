FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
COPY orm.config.docker.json ./orm.config.json
RUN npm run migration:create first
RUN npm run migration:generate first
RUN npm run migration:run

EXPOSE 4000
CMD ["npm", "run",  "start:prod"]