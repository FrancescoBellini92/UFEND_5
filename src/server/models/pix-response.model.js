class PixResponse {
  pageURL;
  previewURL;
  webformatURL;

  constructor(input) {
    Object.assign(this, input)
  }
}

module.exports = PixResponse;
