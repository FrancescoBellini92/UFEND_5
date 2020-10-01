import tripCardTemplate from './trip-card.component.html';
import { WebComponent } from '../../base/web-component';

// function testDecorator(target, name, descriptor) {
//   debugger;
// }
// @testDecorator()
export default class TripCardComponent extends WebComponent {

  static SELECTOR = "trip-card";


  _html = tripCardTemplate;

  _startDate;
  _endDate;
  _location;
  _name;

  _trip;
  _submitBtn;

  constructor() {
    super();
    this._init();
    this._queryTemplate();
    this._attachEventHandlers();
  }

  static define() {
    super.define(TripCardComponent);
  }

  update({ id, name, location, start, end }) {
    this._name.textContent = name;
    this._location.textContent = location;
    this._startDate.textContent = start;
    this._endDate.textContent = end;
    this._trip = {
      id,
      name,
      location,
      start,
      end
    };
  }
  
  _queryTemplate() {
    this._startDate = this.querySelector('#start-date');
    this._endDate = this.querySelector('#end-date');
    this._location = this.querySelector('#location');
    this._name = this.querySelector('#name');
    // this._submitBtn = $('#submit');
  }

  _attachEventHandlers() {
    // this._submitBtn.addEventListener('click', this._onSubmit);
  }

  _onSubmit = (event) => {
    const notValid = inputNotValid(this._startDate) || inputNotValid(this._endDate) || inputNotValid(this._location);
    if (notValid) {
      return;
    }
    event.preventDefault();
    this._emitSubmit();
  }

  _emitSubmit() {
    const eventBody = {
      startDate: this._startDate.value,
      endDate: this._endDate.value,
      location: this._location.value,
      name: this._name.value
    };
    const submitEvent = new CustomEvent('submit', {detail: eventBody });
    this.dispatchEvent(submitEvent);
  }



}
