FROM mongo

COPY addresses.json /addresses.json
CMD mongoimport --host mongodb --db ganChallengeDb --collection cities --type json --file /addresses.json --jsonArray --drop
