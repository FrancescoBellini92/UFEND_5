import { $, show, hide } from './DOM-utils/DOM-utils';
import Observable from './base/observable';
import TripFormComponent from './components/trip-form/trip-form.component';
import TripListComponent from './components/trip-list/trip-list.component';
import TripCardComponent from './components/trip-card/trip-card.component';
import TripService from './services/trip.service';
import * as moment from 'moment';

TripFormComponent.define();
TripListComponent.define();
TripCardComponent.define();

const tripService = new TripService();

export default () => {

  const detailAnchor = $('#detail-anchor');
  const homePage = $('#home-page');
  const emptyContainer = $('#empty-container');
  const homeTitle = $('#home-title');
  const tripCardContainer = $('#card-container');
  
  const addPage = $('#add-page');
  const tripForm = $('#trip-form');
  const loader = $('#loader');
  const addSuccessAlert = $('#add-success');
  const addErrorAlert = $('#add-error');

  const detailPage = $('#detail-page');
  const detailTitle = $('#detail-title');
  const detailCard = $('#detail-card');
  detailCard.hideChildren('#view');
  const weatherList = $('#weather-list');

  weatherList.makeListStrategyFn = ({valid_date, temp, weather}) => 
    `<p><strong>${moment(valid_date).format('L')}</strong></p><p>${weather.description} - ${temp} °C</p><button>&#10005;</button>`; 
  const removedAlert = $('#detail-deleted');

  const cardTripMap = new Map();

  function initCards() {
    const fragment = document.createDocumentFragment();
    tripService.trips.forEach(trip => {
      const tripCard = new TripCardComponent();
      cardTripMap.set(trip.general.id, tripCard);
      tripCard.updateProps(trip)
      fragment.appendChild(tripCard);
    })
    tripCardContainer.appendChild(fragment);
  }

  const addTripReq$ = new Observable(async([name, start, end, location]) => {
      hide(addErrorAlert, addSuccessAlert);
      show(loader);
      const newTrip = await tripService.add(name, start, end, location);
      return newTrip;
  });

  addTripReq$.subscribe((trip) => {
    hide(loader);
    if(trip.error) {
      show(addErrorAlert);
      return;
    }
    tripForm.reset();
    const tripCard = new TripCardComponent();
    cardTripMap.set(trip.general.id, tripCard);
    tripCard.updateProps(trip)
    tripCardContainer.insertBefore(tripCard, tripCardContainer.firstChild);
    setCurrentTrip(trip);
    show(addSuccessAlert);
  });

  function setCurrentTrip(trip) {
    show(detailAnchor);
    tripService.currentTrip = trip;
    detailCard.updateProps(trip);
    weatherList.addMany(trip.weather);
  }

  function onView({detail}) {
    const currentTrip = detail.trip;
    setCurrentTrip(currentTrip);
    navigateTo('#detail');
  }

  function navigateTo(hash) {
    window.location.hash = hash;
  }

  function scrollOnTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });  }

  async function onSubmit({detail}) {
    try {
      addTripReq$.next(detail.name, detail.startDate, detail.endDate, detail.location);
    } catch (e) {
      alert('Something went wrong :(')
    } 
  }

  function onRemoveFromHome({detail}) {
    const tripId = detail.id;
    const element = detail.element;
    tripService.delete(tripId);
    element.remove();
    if (!tripService.trips.length) {
      show(emptyContainer)
      hide(homeTitle)
    }
  }

  function onRemoveFromDetail({detail}) {
    const tripID = detail.id;
    const element = detail.element;
    tripService.currentTrip = null;
    hide(detailAnchor);
    const homeCardAssociated = cardTripMap.get(tripID);
    onRemoveFromHome({detail: {id: tripID, element: homeCardAssociated}});
    hide(element);
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
          hide(homePage);
          hide(detailPage);
          hide(addSuccessAlert);
          hide(addErrorAlert);
          show(addPage);    
        };
        break;
      case '#detail':
        navigationFn = () => {
          if(!tripService.currentTrip) {
            navigateTo('');
            return;
          }
          hide(homePage);
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
          if (tripService.trips.length) {
            hide(emptyContainer);
            show(homeTitle);
          }
          show(homePage);    
        };
    }
    navigationFn();
    scrollOnTop();
  }

  function initApp() {
    onNavigation();
    initCards();
  }

  tripForm.addEventListener('submit', onSubmit);
  tripCardContainer.addEventListener('remove', onRemoveFromHome)
  tripCardContainer.addEventListener('view', onView)
  detailCard.addEventListener('remove', onRemoveFromDetail)
  weatherList.addEventListener('remove', ({detail}) => {
    const element = detail.element;
    debugger;
    if (TripService.isEmpty(element.data)) {
      hide(element);
    }
  });
  window.addEventListener('hashchange', onNavigation);

  initApp();
}


