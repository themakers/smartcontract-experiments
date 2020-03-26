FROM node:10-alpine

RUN apk add --no-cache make gcc g++ python git bash

# "node_modules" layers
COPY package.json /tmp/package.json
COPY yarn.lock /tmp/yarn.lock
RUN cd /tmp && yarn install
RUN mkdir -p /smartcontract-experiments && cp -a /tmp/node_modules /smartcontract-experiments/

# "app" layers
WORKDIR /smartcontract-experiments
COPY . .

ENV DOCKER true

CMD [ "sh" ]
