const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');
require('@babel/polyfill');

const { MODE, API_WEATHERBIT_MAX_FORECAST } = require('../environment');
const { EmptyResponseError } = require('../factories/response-factory');

const { getGeoData, getWeatherData, getPixData } = require('../controller/external-API.controllers');
const WeatherResponse = require('../models/weather-response.model');

const app = express();
app.use(logger, bodyParser.json(), cors());

function logger (req, res, next) {
  console.log('Request', 'method', req.method, 'pathname', req.url);
  next();
}

app.get(
  '/trip-info',
  (req, res, next) => {
    // check parameters defined
    const hasQueryParams = req.query && req.query.name && req.query.start && req.query.end && req.query.location;
    hasQueryParams ? next() : res.status(400).json({ error: 'missing required query parameters' });
  },
  (req, res, next) => {
    // parameters validation
    const today = moment();
    const isStartAfterPast = moment(req.query.start).isSameOrAfter(today, 'days');
    const isEndAfterStart = moment(req.query.end).isSameOrAfter(req.query.start, 'days');
    (isStartAfterPast && isEndAfterStart) ? next() : res.status(400).json({ error: 'bad dates' });
  },
  async (req, res) => {
    try {
      const APIRequest = await Promise.all([
        getGeoData(req),
        getPixData(req)
      ]);
      const start = req.query.start;
      const end = req.query.end;
      const [ geoAPIResponse, pixAPIResponse ] = APIRequest;
      const lat = geoAPIResponse.lat;
      const lon = geoAPIResponse.lng;
      const [deltaDaysFromStart, deltaDaysFromEnd] = WeatherResponse.calculateDeltaDays(start, end);
      const isWithinMaxForecast = deltaDaysFromStart  <= API_WEATHERBIT_MAX_FORECAST;
      const weatherAPIResponse = isWithinMaxForecast ? await getWeatherData({query: {lat, lon, days: deltaDaysFromEnd}}) : [];

      const general = {
        start,
        end,
        location: req.query.location,
        name: req.query.name
      }

      const APIResponse = {general, geo: geoAPIResponse, pix: pixAPIResponse, weather: weatherAPIResponse};
      res.json(APIResponse);
    } catch (e) {
      if (e instanceof EmptyResponseError) {
        res.status(400).json({ error: 'bad location' });
        return;
      }
      throw e;
    }
  }
);

if (MODE === 'PROD') {
  app.use(express.static('dist'));
}

module.exports = app;
