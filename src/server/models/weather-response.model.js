/* eslint-disable no-undef */
/* eslint-disable camelcase */
const BaseModel = require('./base.model');
const moment = require('moment');

class WeatherData extends BaseModel {
  // wind_spd;
  // wind_cdir_full;
  temp;
  // max_temp;
  // min_temp;
  valid_date;
  weather = {
    icon: undefined,
    description: undefined
  };

  constructor(input) {
    super();
    this._initProps(input);
  }
}

class WeatherResponse {
  data = [];

  constructor(weatherData) {
    this.data = weatherData;
    this.data = this.data.map(item => new WeatherData(item));
    return this.data;
  }

  
  static calculateDeltaDays(startDate, endDate) {
    const start = moment(startDate);
    const end = moment(endDate);
    const today = moment();
    let deltaDaysFromEnd = end.diff(today, 'days');
    deltaDaysFromEnd = deltaDaysFromEnd ? deltaDaysFromEnd + 2 : 1;
    let deltaDaysFromStart = start.diff(today, 'days');
    deltaDaysFromStart = deltaDaysFromStart ? deltaDaysFromStart + 2 : 1;
    return [ deltaDaysFromStart, deltaDaysFromEnd ];
  }
}

module.exports = WeatherResponse;
