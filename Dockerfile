################################################################
#### base image
FROM node:10-alpine as base

RUN apk add --no-cache make gcc g++ python git bash

################################################################
#### node_modules handler
FROM base as node_modules

WORKDIR /

COPY package.json .
COPY yarn.lock .
RUN  yarn install

################################################################
#### final container
FROM base

COPY --from=node_modules /node_modules /smartcontract-experiments/node_modules

WORKDIR /smartcontract-experiments
COPY . .

ENV DOCKER true
