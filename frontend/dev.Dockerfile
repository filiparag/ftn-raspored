FROM node:16-slim

WORKDIR /usr/src/app
ENV CHOKIDAR_USEPOLLING=true
ENV NODE_ENV=dev

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . ./
RUN npx browserslist@latest --update-db

ENTRYPOINT ["yarn", "start"]

EXPOSE 3000/tcp

