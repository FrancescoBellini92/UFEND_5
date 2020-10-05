const BaseModel = require('./base.model');
const fetch = require('node-fetch');
const fs = require('fs');

class PixResponse extends BaseModel {
  pageURL;  
  previewURL;
  webformatURL;
  picture;

  constructor(input) {
    super();
    this._initProps(input);

    // fetch(this.webformatURL)
    // .then(response => response.buffer())
    // .then(blob => {
    //   const b64Pic = fs.readFile(this.webformatURL).toString('base64');
    //   this.picture = b64Pic;
    //     });
  }
}

module.exports = PixResponse;
