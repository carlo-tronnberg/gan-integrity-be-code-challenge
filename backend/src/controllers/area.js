'use strict';

const City = require('./cities.js');
const AreaResult = require('./result.js');
const { getDistanceFromLatLonInKm } = require('../tools/distance.js');

//not nice
//need this for error handling
//let requestId;

/**
 * Calculates the cities near a given city within a specified distance.
 * @param {Object} message - An object containing the following properties:
 *   - from {string} - The GUID of the city to calculate near cities for.
 *   - distance {number} - The maximum distance in kilometers.
 *   - requestId {string} - The ID of the request.
 * @returns {Object} - An object containing the updated result document from the database.
 */
const calculateNearCities = async (message) => {
  try {
    console.log(
      `Calculating near cities of ${message.from} within ${message.distance}`,
    );
    //const requestId = message.requestId;
    //preset the result
    // Insert or update the result document in the database with the initial values
    let { result, error } = await AreaResult.insertOrUpdateResult({
      requestId: message.requestId,
      from: message.from,
      distance: message.distance,
      unit: 'km',
      cities: [],
      done: false,
    });

    // Retrieve the city information based on the 'from' GUID
    ({ result, error } = await City.getCityByGUID(message.from));
    if (error) throw new Error(error);

    if (result === null)
      throw new Error(`No city found with guid ${message.from}`);
    const from = result;

    const cities = await City.getCityCursor();
    const nearCities = [];

    // Iterate through each city
    while (await cities.hasNext()) {
      let city = await cities.next();
      // Skip if the city's GUID is the same as the 'from' GUID
      if (city.guid == from.guid) continue;
      // Calculate the distance between the 'from' city and the current city
      let distance = getDistanceFromLatLonInKm(
        from.latitude,
        from.longitude,
        city.latitude,
        city.longitude,
      );

      // Add the city's information to the 'nearCities' array if the distance is less than the specified distance
      if (distance < message.distance) {
        let { guid, longitude, latitude, address, tags } = city;
        nearCities.push({ guid, longitude, latitude, address, tags });
      }
    }

    // Update the result document in the database with the final values
    ({ result, error } = await AreaResult.insertOrUpdateResult({
      requestId: message.requestId,
      from: message.from,
      distance: message.distance,
      unit: 'km',
      cities: nearCities,
      valid: true,
      error: null,
      done: true,
    }));

    if (error) throw new Error(error);

    return { result };
  } catch (error) {
    //don't know if good idea  to store the error in the results object
    // Store the error in the results object
    await AreaResult.insertOrUpdateResult({
      requestId: message.requestId,
      error: error.message,
      valid: false,
      cities: [],
      done: true,
    });

    console.error(error);

    return { error };
  }
};

module.exports = { calculateNearCities };
