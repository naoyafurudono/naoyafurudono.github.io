FROM node:21

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
WORKDIR /app
RUN npm install
COPY . /app/
RUN npm run build
CMD ["npm", "start"]
