FROM node:alpine
WORKDIR /kinematics
COPY package.json .
RUN npm i
COPY tsconfig.json tsconfig.json
COPY src src
RUN npx tsc
CMD node dist/main.js
