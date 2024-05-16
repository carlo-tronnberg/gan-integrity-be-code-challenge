# GAN Integrity backend code challenge
[Metrics report](metrics.md) -
[Complexity report](complexity-report.md)

---

## Installation

For setup simplicity, this project is supposed to run in Docker.

To set up the backend, you need [Node.js](https://nodejs.org/en/download/) installed.


To install dependencies, run the following in the ***backend*** directory:

```sh
cd backend
npm install
```
### Setting up the app in Docker:

Open your terminal, go down to the ***backend*** directory and execute
```
docker compose up --build
```

This will 
- Create a backend container for the backend running on port ***3000*** based on the ***keymetrics/pm2:latest-alpine*** docker image
- configure a [MongoDB](https://docs.mongodb.com/) database
- empty it if it already exists
- populate it with the provided ***addresses.json*** data file
- Setup the [RabbitMQ](https://www.rabbitmq.com/) message-broker

Once the ***backend*** is running in Docker, run the challenging application in the parent directory following the description: [Challenge description](../README.md)

## Testing (optional)

All tests are run in the ***backend*** directory. Make sure you are in it before proceeding.

[package.json](package.json) in the ***backend directory*** defines several scripts which can be run with 

```sh
npm run <scriptname>
```

The main testing scripts are

### Running all tests

```sh
npm run test
```

### Testing the features

```sh
npm run test:bdd
```

### Unit Tests

```sh
npm run test:unit
```
---

## Notes

I started developing the backend with BDD/TDD and tests can be run accordingly. Due to time limitation I only created a few.

I took the liberty to change the backend port from ***8080*** to ***9080*** (adjusting in [index.js](../index.js)) as it was conflicting with another project I am working on. It can easily be changed back.

---
[Challenge description](../README.md)