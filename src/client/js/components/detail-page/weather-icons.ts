import { Weather } from "../../models/trip.model";

function importAll(webpackContext) {
  const images = {};
  webpackContext.keys().forEach(item => images[item.replace('./', '')] = webpackContext(item));
  return images;
}

const images = importAll(require['context']('../../../../assets/icons/weather-icons', false, /\.(png|jpe?g|svg)$/));

const getWeatherIcon = (weatherInfo: Weather) => images[`${weatherInfo.weather.icon}.png`].default;

export default getWeatherIcon;