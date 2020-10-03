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

  const tripForm = $('#trip-form');
  const tripList = $('#trip-list');
  const tripCardContainer = $('#card-container');
  const home = $('#home');
  const analysisContainer = $('#analysis-container');
  const confidenceInput = $('#confidence');
  const scoreInput = $('#score');
  const agreementInput = $('#agreement');
  const subjectivityInput = $('#subjectivity');
  const ironyInput = $('#irony');
  tripList.updateProps(tripService.trips);
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
    tripCardContainer.appendChild(tripCard);
    tripList.add(trip.general);
  });

  async function onSubmit({detail}) {
    try {
      addTripReq$.next(detail.name, detail.startDate, detail.endDate, detail.location);
      // debugger;
      // if (inputNotValid(textInput)) {
      //   throw new Error('Validation error: input was not valid');
      // }
      // e.preventDefault();
      // show(loader);
      // const escapedText = escape(textInput.value)
      // const url = `${environment.APIURL}?text=${escapedText}`;
      // const analysisRequest = await sendRequest(url, isProd);
      // const analysisResponse = await manageRequestResponse(
      //   analysisRequest,
      //   response => !response.ok,
      //   response => response.status === 400 ? alert('Sorry, we could not analyze this text: try with a longer sentence') : null);
      // renderResponse(analysisResponse);
      // show(analysisContainer);
    } catch (e) {
      alert('Something went wrong :(')
    } finally {
      // hide(loader)
    }

    // function renderResponse(response) {
    //   confidenceInput.innerText = response.confidence;
    //   scoreInput.innerText = response.score_tag;
    //   agreementInput.innerText = response.agreement.toLowerCase();
    //   subjectivityInput.innerText = response.subjectivity.toLowerCase();
    //   ironyInput.innerText = response.irony.toLowerCase();
    // }
  }

  function onRemove({detail}) {
    const tripId = detail;
    tripService.delete(tripId);
  }

  function onNavigation() {
    const hash = window.location.hash ?? '#home';
    routeManager[hash]();
  }

  const routeManager = {
    '#home': () => {
      show(home);
    }
  }

  function initApp() {
    onNavigation();
  }

  tripForm.addEventListener('submit', onSubmit);
  tripList.addEventListener('remove', onRemove)
  tripCardContainer.addEventListener('remove', onRemove)
  window.addEventListener('popstate', onNavigation);
  window.addEventListener('hashchange', onNavigation);

  initApp();
}
