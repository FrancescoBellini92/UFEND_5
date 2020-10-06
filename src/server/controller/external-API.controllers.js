const { 
  API_KEY_GEO, 
  API_GEO_BASEURL,  
  API_KEY_WEATHERBIT, 
  API_WEATHERBIT_BASEURL, 
  API_KEY_PIXABAY, 
  API_PIXABAY_BASEURL 
} = require('../environment');

const { 
  makeGeoResponse, 
  makePixResponse, 
  makeWeatherResponse, 
  EmptyResponseError 
} = require('../factories/response-factory');

const fetch = require('node-fetch');

async function getDataFromAPI(req, urlBuilderFn, factoryFn, emptyResponseFallback) {
  try {
    const url = urlBuilderFn(req.query);
    const request = await fetch(url);
    const response = await request.json();
    const parsedResponse = factoryFn(response);
    return parsedResponse;
  } catch (e) {
    if (e instanceof EmptyResponseError) {
      if(emptyResponseFallback) {
        return emptyResponseFallback;
      }
    }
    throw e;
  }
};

async function getGeoData(req) {
  return getDataFromAPI(
    req,
    (queryParams) => `${API_GEO_BASEURL}?username=${API_KEY_GEO}&name=${queryParams.location}`,
    makeGeoResponse
    // no emptyResponse fallback: other API requests depend on geo payload, so exception must be thrown
  );
}

async function getWeatherData(req) {
  return getDataFromAPI(
    req,
    (queryParams) => `${API_WEATHERBIT_BASEURL}?lat=${queryParams.lat}&lon=${queryParams.lon}&days=${queryParams.days}&key=${API_KEY_WEATHERBIT}`,
    makeWeatherResponse,
    []
  );
}

async function getPixData(req) {
  return getDataFromAPI(
    req,
    (queryParams) => `${API_PIXABAY_BASEURL}?key=${API_KEY_PIXABAY}&q=${queryParams.location}&category=places&editors_choice=true&per_page=10`,
    makePixResponse,
    []
  );
}

module.exports = {
  getGeoData,
  getWeatherData,
  getPixData
};
