const dotEnv = require('dotenv');
dotEnv.config();
module.exports = {
  PORT: process.env.PORT,
  API_KEY_GEO: process.env.API_KEY_GEO,
  API_GEO_BASEURL: process.env.API_GEO_BASEURL,
  API_KEY_WEATHERBIT: process.env.API_KEY_WEATHERBIT,
  API_WEATHERBIT_BASEURL: process.env.API_WEATHERBIT_BASEURL,
  API_WEATHERBIT_MAX_FORECAST: process.env.API_WEATHERBIT_MAX_FORECAST,
  API_KEY_PIXABAY: process.env.API_KEY_PIXABAY,
  API_PIXABAY_BASEURL: process.env.API_PIXABAY_BASEURL,
  MODE: process.env.MODE
};
