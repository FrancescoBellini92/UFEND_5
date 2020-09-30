import { $, show, hide, inputNotValid } from './DOM-utils/DOM-utils';
import Observable from './base/observable';
import TripFormComponent from './components/trip-form/trip-form.component';
import TripListComponent from './components/trip-list/trip-list.component';
import TripService from './services/trip.service';
TripFormComponent.define();
TripListComponent.define();

const tripService = new TripService();

export default () => {
  const loader = $('#loader');

  const tripForm = $('#trip-form');
  const tripList = $('#trip-list');
  const analysisContainer = $('#analysis-container');
  const confidenceInput = $('#confidence');
  const scoreInput = $('#score');
  const agreementInput = $('#agreement');
  const subjectivityInput = $('#subjectivity');
  const ironyInput = $('#irony');
  debugger;
  tripList.updateMany(tripService.trips);


  const addTripReq$ = new Observable(async([name, start, end, location]) => {
      show(loader);
      const newTrip = await tripService.add(name, start, end, location);
      debugger;
      return newTrip;
  });

  addTripReq$.subscribe((data) => {
    debugger;
    hide(loader);
    tripForm.reset();
    tripList.update(data.general);
  });

  async function createTrip({detail}) {
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
  tripForm.addEventListener('submit', createTrip);
}
