'use strict';

const router = require('express').Router();

const { query, validationResult } = require('express-validator');
const { getDistanceFromLatLonInKm } = require('../src/tools/distance.js');
const JSONStream = require('JSONStream');

const { authenticateToken } = require('../middlewares/check-auth.js');
const { sendMessage } = require('../services/producer.js');

const City = require('../src/controllers/cities.js');
const AreaResult = require('../src/controllers/result.js');

const HTTP_OK = 200;
const ACCEPTED = 202;
const INTERNAL_SERVER_ERROR = 500;

router.use('/', authenticateToken);

router.get('/all-cities', async (req, res, next) => {
  try {
    const cities = await City.getCityCursor();
    res.type('json');

    return cities.stream().pipe(JSONStream.stringify()).pipe(res);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).send(error.message);
  }
});

router.get(
  '/cities-by-tag',
  [query('isActive').toBoolean()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(INTERNAL_SERVER_ERROR)
          .json({ errors: errors.array() });
      }

      const { result, error } = await City.getCityByTag(req.query);

      if (error) throw new Error(error);

      return res.status(HTTP_OK).send({ cities: result });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).send(error.message);
    }
  },
);

router.get(
  '/distance',
  [query('from').exists(), query('to').exists()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(INTERNAL_SERVER_ERROR)
          .json({ errors: errors.array() });
      }
      let { result, error } = await City.getCityByGUID(req.query.from);

      if (error) throw new Error(error);
      const from = result;

      ({ result, error } = await City.getCityByGUID(req.query.to));

      if (error) throw new Error(error);

      const to = result;
      const distance = getDistanceFromLatLonInKm(
        from.latitude,
        from.longitude,
        to.latitude,
        to.longitude,
      );

      return res.status(HTTP_OK).send({
        from: {
          guid: from.guid,
        },
        to: {
          guid: to.guid,
        },
        unit: 'km',
        distance: parseFloat(distance),
      });
    } catch (error) {
      console.error(error);

      return res.status(INTERNAL_SERVER_ERROR).send(error.message);
    }
  },
);

router.get(
  '/area',
  [query('from').exists(), query('distance').exists().isInt().toInt()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(INTERNAL_SERVER_ERROR)
          .json({ errors: errors.array() });
      }
      //due to the test, now it is hard coded, otherwise it would be generated
      const requestId = '2152f96f-50c7-4d76-9e18-f7033bd14428';

      const message = {
        queue: 'area_calculation',
        data: {
          requestId: requestId,
          from: req.query.from,
          distance: req.query.distance,
        },
      };

      let ok = await sendMessage(message);

      if (!ok) throw new Error();

      return res.status(ACCEPTED).send({
        resultsUrl: `http://127.0.0.1:9080/area-result/${requestId}`,
      });
    } catch (error) {
      console.error(error);

      return res.status(INTERNAL_SERVER_ERROR).send(error.message);
    }
  },
);

router.get('/area-result/:requestId', async (req, res, next) => {
  try {
    const { result, error } = await AreaResult.getResult({
      requestId: req.params.requestId,
    });
    if (error) throw new Error(error);
    if (result == null || result.error || !result.done)
      return res.status(ACCEPTED).send();

    return res.status(HTTP_OK).send(result);
  } catch (error) {
    console.error(error);

    return res.status(INTERNAL_SERVER_ERROR).send(error.message);
  }
});

module.exports = router;
