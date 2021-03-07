const BaseModel = require('./base.model');
const fetch = require('node-fetch');

class PixResponse extends BaseModel {
  webformatURL;

  constructor(input) {
    super();
    this._initProps(input);
  }

  async base64() {
    const imageResponse = await fetch(this.webformatURL);
    const imageBlob = await imageResponse.buffer();
    this.webformatURL = imageBlob.toString('base64');
    return this;
  }
}

module.exports = PixResponse;
