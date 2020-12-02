const BaseModel = require('./base.model');

class PixResponse extends BaseModel {
  pageURL;
  previewURL;
  webformatURL;
  picture;

  constructor(input) {
    super();
    this._initProps(input);
  }
}

module.exports = PixResponse;
