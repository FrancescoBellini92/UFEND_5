import { show, hide } from './DOM-utils/DOM-utils';
import Observable from './base/observable';
import TripFormComponent from './components/trip-form/trip-form.component';
import TripListComponent from './components/trip-list/trip-list.component';
import TripService from './services/trip.service';
import * as moment from 'moment';
import HomePageComponent from './components/home-page/home-page.component';
import TripCardComponent from './components/trip-card/trip-card.component';
import { AddFormSubmitEvent, CardRemoveEvent, CardViewEvent, ListRemoveEvent } from './models/events';
import TripRequest from './models/trip.request';
import Trip from './models/trip.model';
import registerComponents from './components/components.module';
import factory from './base/factory';
import AddPageComponent from './components/add-page/add-page.component';

registerComponents();

const tripService = factory.make<TripService>(TripService.injectionToken);

export default () => {
  const detailAnchor = document.getElementById('detail-anchor');

  const homePage = document.getElementById('home-page') as HomePageComponent;
  const addPage = document.getElementById('add-page') as AddPageComponent;

  const detailPage = document.getElementById('detail-page');
  const detailTitle = document.getElementById('detail-title');
  const detailCard = document.getElementById('detail-card') as TripCardComponent;
  detailCard.hideChildren('#view');
  const weatherList = document.getElementById('weather-list') as TripListComponent;
  weatherList.title = 'Weather forecast';

  weatherList.makeListStrategyFn = ({ valid_date, temp, weather }) =>
    `<p><strong>${moment(valid_date).format('L')}</strong></p><p>${weather.description} - ${temp} °C</p><button>&#10005;</button>`;
  const removedAlert = document.getElementById('detail-deleted');


  function setCurrentTrip(trip) {
    show(detailAnchor);
    detailCard.updateProps(trip);
    weatherList.addMany(trip.weather);
  }

  function navigateTo(hash) {
    window.location.hash = hash;
  }

  function scrollOnTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function onRemoveFromDetail(e: CardRemoveEvent) {
    tripService.currentTrip = null;
    hide(detailAnchor);
    hide(detailTitle);
    hide(weatherList);
    show(removedAlert);
  }

  function onNavigation() {
    const hash = window.location.hash;
    let navigationFn;
    switch (hash) {
      case '#add':
        navigationFn = () => {
          homePage.hide();
          addPage.show();
          hide(detailPage);
        };
        break;
      case '#detail':
        navigationFn = () => {
          if (!tripService.currentTrip) {
            navigateTo('');
            return;
          }
          homePage.hide();
          addPage.hide();
          show(detailPage);
          show(detailTitle);
          show(detailCard);
          show(weatherList);
        };
        break;
      case '#back':
        navigationFn = () => {
          window.history.back();
          window.history.back();
        }
        break;
      default:
        navigationFn = () => {
          addPage.hide();
          hide(detailPage);
          homePage.show();
        };
    }
    navigationFn();
    scrollOnTop();
  }

  function initApp() {
    onNavigation();
  }

  detailCard.addEventListener('remove', onRemoveFromDetail);
  weatherList.addEventListener('remove', (e: ListRemoveEvent) => {
    const element = e.detail.element;
    if (TripService.isEmpty(element.data)) {
      hide(element);
    }
  });
  window.addEventListener('hashchange', onNavigation);

  initApp();
}
