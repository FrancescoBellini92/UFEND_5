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
import factory from './factory/factory';

registerComponents();

const tripService = new TripService();

export default () => {
  const detailAnchor = document.getElementById('detail-anchor');

  const homePage = document.getElementById('home-page') as HomePageComponent;

  const addPage = document.getElementById('add-page');
  const tripForm = document.getElementById('trip-form') as TripFormComponent;
  const loader = document.getElementById('loader');
  const addSuccessAlert = document.getElementById('add-success');
  const addErrorAlert = document.getElementById('add-error');

  const detailPage = document.getElementById('detail-page');
  const detailTitle = document.getElementById('detail-title');
  const detailCard = document.getElementById('detail-card') as TripCardComponent;
  detailCard.hideChildren('#view');
  const weatherList = document.getElementById('weather-list') as TripListComponent;
  weatherList.title = 'Weather forecast';

  weatherList.makeListStrategyFn = ({ valid_date, temp, weather }) =>
    `<p><strong>${moment(valid_date).format('L')}</strong></p><p>${weather.description} - ${temp} °C</p><button>&#10005;</button>`;
  const removedAlert = document.getElementById('detail-deleted');


  const addTripReq$ = new Observable<TripRequest, Trip>(async(tripRequest: TripRequest) => {
    hide(addErrorAlert, addSuccessAlert);
    show(loader);
    const newTrip: Trip = await tripService.add(tripRequest);
    return newTrip;
  });

  addTripReq$.subscribe((trip: Trip) => {
    hide(loader);
    if (trip.error) {
      show(addErrorAlert);
      return;
    }
    tripForm.reset();
    homePage.updateProps([trip]);
    setCurrentTrip(trip);
    show(addSuccessAlert);
  });

  function setCurrentTrip(trip) {
    show(detailAnchor);
    tripService.currentTrip = trip;
    detailCard.updateProps(trip);
    weatherList.addMany(trip.weather);
  }

  function onView(e: CardViewEvent) {
    const currentTrip = e.detail;
    setCurrentTrip(currentTrip);
    navigateTo('#detail');
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

  async function onSubmit(e: AddFormSubmitEvent) {
    try {
      addTripReq$.next(e.detail);
    } catch (e) {
      alert('Something went wrong :(')
    }
  }

  function onRemoveFromHome(e: CardRemoveEvent) {
    const tripId = e.detail;
    tripService.delete(tripId);
    homePage.onRemove(tripId);
  }

  function onRemoveFromDetail(e: CardRemoveEvent) {
    const tripID = e.detail;
    tripService.currentTrip = null;
    hide(detailAnchor);
    onRemoveFromHome(e);
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
          hide(detailPage);
          hide(addSuccessAlert);
          hide(addErrorAlert);
          show(addPage);
        };
        break;
      case '#detail':
        navigationFn = () => {
          if (!tripService.currentTrip) {
            navigateTo('');
            return;
          }
          homePage.hide();
          hide(addPage);
          hide(removedAlert);
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
          hide(addPage);
          hide(detailPage);
          homePage.show();
        };
    }
    navigationFn();
    scrollOnTop();
  }

  function initCards() {
    homePage.updateProps(tripService.trips);
  }

  function initApp() {
    document.addEventListener('dependencyInjection', (e: CustomEvent) => {
      const client = e.target;
      const token = e.detail;
      const dependency = factory.make(e.detail);
      Object.defineProperty(client, token, dependency);
      debugger;
    })
    initCards();
    onNavigation();
  }




  tripForm.addEventListener('submit', onSubmit);
  homePage.addEventListener('remove', onRemoveFromHome);
  homePage.addEventListener('view', onView);
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
