FROM node:19-alpine3.16

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY .. .

EXPOSE 4173

RUN npm run build
ENV DATABASE_URL="file:./dev.db"
RUN npx prisma generate

CMD [ "npm", "run", "preview" ]
