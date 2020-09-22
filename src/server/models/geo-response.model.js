class GeoResponse {
  name;
  countryName;
  lng;
  lat;

  constructor(input) {
    Object.assign(this, input);
  }
}

module.exports = GeoResponse;
