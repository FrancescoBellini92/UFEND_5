const BaseModel = require('./base.model');

class GeoResponse extends BaseModel{
  name;
  countryName;
  lng;
  lat;

  constructor(input) {
    super();
    this._initProps(input)
  }
}

module.exports = GeoResponse;
