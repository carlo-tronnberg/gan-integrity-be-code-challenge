# GAN Integrity backend code challenge

---

## Installation

For setup simplicity, this project is supposed to run in Docker.

To set up the backend, you need [Node.js](https://nodejs.org/en/download/) installed.


To install dependencies, run the following:

```sh
npm install
```
### Setting up the app in Docker:

Open your terminal, go down to the backend directory and execute
```
docker compose up --build
```

This will 
- Create a backend container for the backend running on port `3000` based on the `keymetrics/pm2:latest-alpine` docker image
- configure a [MongoDB](https://docs.mongodb.com/) database
- empty it if it already exists
- populate it with the provided `addresses.json` data file
- Setup the [RabbitMQ](https://www.rabbitmq.com/) message-broker

Once the backend is running in Docker, either open another terminal and follow the description in the parent directory: [Challenge description](../README.md)

## Run the tests

To run the tests, there is a script in the project root called `test`. It calculates code coverage, incorporates
watch mode, and prints in verbose mode, so all test file's test report will be visible. Alternatively, you
can achieve the same with the command the script contains:

```sh
npm test -- --watchAll --collect-coverage --verbose
```