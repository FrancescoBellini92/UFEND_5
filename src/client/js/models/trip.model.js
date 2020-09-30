export default class Trip {
  general = {
    id: undefined,
    start: undefined,
    end: undefined,
    location: undefined,
    name: undefined
  };

  geo = {
    name: undefined,
    countryName: undefined,
    lng: undefined,
    lat: undefined
  };

  pix = {
    pageURL: undefined,
    previewURL: undefined,
    webformatURL: undefined
  };

  weather = {
    temp: undefined,
    valid_date: undefined,
    weather: {
        icon: undefined,
        description: undefined
    }
  };

  constructor(input) {
    Object.assign(this, input);
  }
}