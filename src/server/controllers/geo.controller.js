const { API_KEY_GEO, API_GEO_BASEURL } = require('../environment');
const { makeGeoResponse, EmptyResponseError } = require('../factories/response-factory');

const express = require('express');
const router = express.Router();

const fetch = require('node-fetch');

router.get('/', async (req, res) => {
  try {
    const locationName = req.query.name;
    const geoRequest = await fetch(`${API_GEO_BASEURL}?username=${API_KEY_GEO}&name=${locationName}`);
    const geoResponse = await geoRequest.json();
    const parsedResponse = makeGeoResponse(geoResponse);
    res.json(parsedResponse);
  } catch (e) {
    if (e instanceof EmptyResponseError) {
      res.status(404);
      res.json([]);
      return;
    }
    throw e;
  }
});

module.exports = router;
