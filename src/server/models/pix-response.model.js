const BaseModel = require('./base.model');

class PixResponse extends BaseModel {
  pageURL;
  previewURL;
  webformatURL;

  constructor(input) {
    super();
    this._initProps(input);
  }
}

module.exports = PixResponse;
