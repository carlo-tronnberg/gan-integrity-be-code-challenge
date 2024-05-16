const { Given, When, Then, Fusion } = require('jest-cucumber-fusion');
const utils = require('../../src/tools/distance');

let coord1;
let coord2;
let response;

Given(
  /^two GPS coordinates (.*), (.*) and (.*), (.*)$/,
  (lat1, lon1, lat2, lon2) => {
    coord1 = { lat: lat1, lon: lon1 };
    coord2 = { lat: lat2, lon: lon2 };
  },
);

When('calling the getDistanceFromLatLonInKm function', async () => {
  try {
    response = await utils.getDistanceFromLatLonInKm(
      coord1.lat,
      coord1.lon,
      coord2.lat,
      coord2.lon,
    );
  } catch (err) {
    return err.message;
  }
});

Then(/^the distance returned should be (.*) km$/, (distance) => {
  expect(response).toBe(distance);
});

Fusion('distance.feature');
