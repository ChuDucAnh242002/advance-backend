# This is where you define the image for
# the server A.

# You should use Node image from Docker Hub as the basis.

FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "index.js" ]
