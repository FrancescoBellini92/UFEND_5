const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { PORT, APIKEY, APIBASEURL, MODE } = require('./environment');

const app = express();
app.use(logger, bodyParser.json(), cors());

function logger (req, res, next) {
  console.log('Request', 'method', req.method, 'pathname', req.url);
  next();
}

app.get(
  '/sentiment-analysis',
  (req, res, next) => req.query && req.query.text ? next() : res.status(400).json({ error: 'missing text query parameter' }),
  async (req, res) => {
    try {
      const text = req.query.text;
      const url = `${APIBASEURL}?key=${APIKEY}&txt=${text}&lang=auto`;
      const APIRequest = await fetch(url, { method: 'POST' });
      const APIResponse = await APIRequest.json();
      console.log('API response', APIResponse);
      if (APIResponse.status.msg !== 'OK') {
        // probably something wrong with the request parameters
        res.status(400).json(APIResponse.status.msg || 'unknown error');
        return;
      }
      res.json({ success: 'true', data: APIResponse });
    } catch (e) {
      res.status(500).send()
      if (MODE === 'PROD') {
        console.error(e);
      } else {
        throw e;
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
