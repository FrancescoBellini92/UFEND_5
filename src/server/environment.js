const dotEnv = require('dotenv');
dotEnv.config();
module.exports = {
  PORT: process.env.PORT,
  APIBASEURL: process.env.API_BASEURL,
  APIKEY: process.env.API_KEY,
  MODE: process.env.MODE
};
