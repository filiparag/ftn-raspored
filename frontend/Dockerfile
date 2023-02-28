FROM node:16-slim

WORKDIR /usr/src/app

RUN yarn global add serve

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN npx browserslist@latest --update-db
RUN yarn build

ENTRYPOINT ["serve", "-s", "build"]

EXPOSE 3000/tcp
