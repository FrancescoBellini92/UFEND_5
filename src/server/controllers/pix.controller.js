const { API_KEY_PIXABAY, API_PIXABAY_BASEURL } = require('../environment');
const { makePixResponse, EmptyResponseError } = require('../factories/response-factory');

const express = require('express');
const router = express.Router();

const fetch = require('node-fetch');

router.get('/', async (req, res) => {
  try {
    const locationName = req.query.q;
    const pixRequest = await fetch(
      `${API_PIXABAY_BASEURL}?key=${API_KEY_PIXABAY}&q=${locationName}&category=places&editors_choice=true&per_page=10`);
    const pixResponseBody = await pixRequest.json();
    const parsedResponse = makePixResponse(pixResponseBody);
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
