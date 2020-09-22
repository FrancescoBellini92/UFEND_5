/* eslint-disable no-undef */
/* eslint-disable camelcase */
class WeatherData {
  wind_spd;
  wind_cdir_full;
  temp;
  max_temp;
  min_temp;
  valid_date;
  weather = {
    icon,
    description
  };

  constructor(input) {
    Object.assign(this, input);
  }
}

class WeatherResponse {
  data = [];

  constructor(weatherData) {
    this.data = weatherData;
    this.data.map(item => new WeatherData(item));
  }
}

module.exports = WeatherResponse;
