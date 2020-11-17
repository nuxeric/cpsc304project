FROM node:alpine

WORKDIR /web

COPY package.json ./

COPY package-lock.json ./

COPY tsconfig.json ./

COPY build.ts ./

COPY ./src/ ./src/

# Run the command inside your image filesystem.
RUN npm install

EXPOSE 8080
CMD ["npm", "start"]
