import { $, show, hide, inputNotValid } from './DOM-utils/DOM-utils';
import Observable from './base/observable';
import TripFormComponent from './components/trip-form/trip-form.component';
import TripListComponent from './components/trip-list/trip-list.component';
import TripCardComponent from './components/trip-card/trip-card.component';
import TripService from './services/trip.service';
TripFormComponent.define();
TripListComponent.define();
TripCardComponent.define();

const tripService = new TripService();

export default () => {
  const loader = $('#loader');

  // const tripList = $('#trip-list');
  
  const homePage = $('#home-page');
  const emptyContainer = $('#empty-container');
  const homeTitle = $('#home-title');
  const tripCardContainer = $('#card-container');
  
  const addPage = $('#add-page');
  const tripForm = $('#trip-form');
  const addSuccessAlert = $('#add-success');
  const analysisContainer = $('#analysis-container');
  const confidenceInput = $('#confidence');
  const scoreInput = $('#score');
  const agreementInput = $('#agreement');
  const subjectivityInput = $('#subjectivity');
  const ironyInput = $('#irony');
  // tripList.updateProps(tripService.trips);
  initCards();

  function initCards() {
    const fragment = document.createDocumentFragment();
    tripService.trips.forEach(trip => {
      const tripCard = new TripCardComponent();
      tripCard.updateProps(trip)
      fragment.appendChild(tripCard);
    })
    tripCardContainer.appendChild(fragment);
  }

  const addTripReq$ = new Observable(async([name, start, end, location]) => {
      show(loader);
      const newTrip = await tripService.add(name, start, end, location);
      return newTrip;
  });
  addTripReq$.subscribe((trip) => {
    hide(loader);
    tripForm.reset();
    const tripCard = new TripCardComponent();
    tripCard.updateProps(trip)
    tripCardContainer.insertBefore(tripCard, tripCardContainer.firstChild);
    show(addSuccessAlert);
    // tripList.add(trip.general);
  });

  function navigateTo(hash) {
    window.location.hash = hash;
  }

  async function onSubmit({detail}) {
    try {
      addTripReq$.next(detail.name, detail.startDate, detail.endDate, detail.location);
    } catch (e) {
      alert('Something went wrong :(')
    } 
  }

  function onRemove({detail}) {
    const tripId = detail;
    tripService.delete(tripId);
    if (!tripService.trips.length) {
      show(emptyContainer)
      hide(homeTitle)
    }
  }

  function onNavigation() {
    const hash = window.location.hash;
    let navigationFn;
    switch (hash) {
      case '#add':
        navigationFn = () => {
          hide(homePage)
          hide(addSuccessAlert);
          show(addPage);    
        };
        break;
      default:
        navigationFn = () => {
          hide(addPage)
          if (tripService.trips.length) {
            hide(emptyContainer)
            show(homeTitle)
          }
          show(homePage);    
        };
    }
    navigationFn();
  }

  function initApp() {
    onNavigation();
  }

  tripForm.addEventListener('submit', onSubmit);
  // tripList.addEventListener('remove', onRemove)
  tripCardContainer.addEventListener('remove', onRemove)
  window.addEventListener('hashchange', onNavigation);

  initApp();
}
