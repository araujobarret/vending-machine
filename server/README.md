# Vending Machine API

## Description

This is a web application that uses a backend to connect to a vending machine providing access to buyers and sellers.

Some features:

- Node.js
- Express
- Mongo with Mongoose
- Typescript
- Hot module reload(nodemon)

## Setup

Create the `.env` file in the same place and format as `.env.example`

To start the server run `yarn install && yarn dev`.

## Testing

**Important**: To test make sure you edit the file `.env.test` and provide a valid mongo database with cluster feature, that can be used locally using the command `npx run-rs -p 27018` but you can use whatever suits best.
There is one service that uses mongo transaction, that is why a cluster is necessary, a single instance does not work.

Once you have the `.env.test` and a running mongo cluster you can run `yarn test`.
