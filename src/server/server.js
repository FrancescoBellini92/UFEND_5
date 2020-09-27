const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');
const { PORT, MODE, API_WEATHERBIT_MAX_FORECAST } = require('./environment');

const { getGeoData, getWeatherData, getPixData } = require('./controllers/controllers');
const WeatherResponse = require('./models/weather-response.model');

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
    const hasQueryParams = req.query && req.query.start && req.query.end && req.query.location; 
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
      const [ geoAPIResponse, pixAPIResponse ] = APIRequest;
      const lat = geoAPIResponse.lat;
      const lon = geoAPIResponse.lng;
      const [deltaDaysFromStart, deltaDaysFromEnd] = WeatherResponse.calculateDeltaDays(req.query.start, req.query.end);
      const isWithinMaxForecast = deltaDaysFromStart  <= API_WEATHERBIT_MAX_FORECAST; 
      const weatherAPIResponse = isWithinMaxForecast ? await getWeatherData({query: {lat, lon, days: deltaDaysFromEnd}}) : [];
      const APIResponse = {geo: geoAPIResponse, pix: pixAPIResponse, weather: weatherAPIResponse};
      res.json(APIResponse);
    } catch (e) {
      res.status(500).send()
      if (MODE === 'DEV') {
        console.error(e);
      }
    }
  }
);

if (MODE === 'PROD') {
  app.use(express.static('dist'));
}
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
