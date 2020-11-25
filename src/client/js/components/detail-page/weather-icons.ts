import { Weather } from "../../models/trip.model";

function importAll(r) {
  console.log(r)
  const images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require['context']('../../../../assets/icons/weather-icons', false, /\.(png|jpe?g|svg)$/));

const getWeatherIcon = (weatherInfo: Weather) => images[`${weatherInfo.weather.icon}.png`].default;

export default getWeatherIcon;