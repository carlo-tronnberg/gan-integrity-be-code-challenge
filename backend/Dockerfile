FROM keymetrics/pm2:latest-alpine

WORKDIR /home/app

RUN NODE_ENV=development npm install

CMD [ "pm2-dev", "process.yml" ]
