const GeoResponse = require('../models/geo-response.model');
const PixResponse = require('../models/pix-response.model');
const WeatherResponse = require('../models/weather-response.model');

class EmptyResponseError extends Error {}

function factory(responseBody, dataProps, parserFn) {
  const noResults = responseBody[dataProps] ? responseBody[dataProps].length === 0 : true;
  if (noResults) {
    throw new EmptyResponseError('empty response');
  }
  return parserFn(responseBody[dataProps]);
}

function makeGeoResponse(responseBody) {
  return factory(responseBody, 'geonames', data => new GeoResponse(data[0]));
}

function makePixResponse(responseBody) {
  return factory(responseBody, 'hits', async data => await new PixResponse(data[0]).base64());
}

function makeWeatherResponse(responseBody) {
  return factory(responseBody, 'data', data => new WeatherResponse(data));
}

module.exports = {
  makeGeoResponse,
  makePixResponse,
  makeWeatherResponse,
  EmptyResponseError
};
