const {
  Given,
  When,
  Then,
  Fusion,
  // eslint-disable-next-line import/no-extraneous-dependencies
} = require('jest-cucumber-fusion');

const utils = require('../../src/tools/distance');

let response;
let latitude1;
let longitude1;
let latitude2;
let longitude2;

// Scenario: Getting the distance between two coordinates
Given(
  /^two GPS coordinates (.*), (.*) and (.*), (.*)$/,
  (lat1, lon1, lat2, lon2) => {
    latitude1 = parseFloat(lat1);
    longitude1 = parseFloat(lon1);
    latitude2 = parseFloat(lat2);
    longitude2 = parseFloat(lon2);
  },
);

When('calling the getDistanceFromLatLonInKm function', async () => {
  try {
    response = await utils.getDistanceFromLatLonInKm(
      latitude1,
      longitude1,
      latitude2,
      longitude2,
    );
  } catch (err) {
    return err.message;
  }
});

Then(/^the distance returned should be (.*) km$/, (distance) => {
  expect(response).toBe(distance);
});

Fusion('distance.feature');
