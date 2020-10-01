import tripFormTemplate from './trip-form.component.html';
import { inputNotValid } from '../../DOM-utils/DOM-utils';
import { WebComponent } from '../../base/web-component';

// function testDecorator(target, name, descriptor) {
//   debugger;
// }
// @testDecorator()
export default class TripFormComponent extends WebComponent {

  static SELECTOR = "trip-form";


  _html = tripFormTemplate;

  _startDate;
  _endDate;
  _location;
  _name;
  _submitBtn;

  constructor() {
    super();
    this._init();
    this._queryTemplate();
    this._attachEventHandlers();
  }

  static define() {
    super.define(TripFormComponent);
  }

  reset() {
    this._startDate.value = this._endDate.value = this._location.value = null;
  }
  
  _queryTemplate() {
    this._startDate = this.querySelector('#star-date');
    this._endDate = this.querySelector('#end-date');
    this._location = this.querySelector('#location');
    this._name = this.querySelector('#name');
    this._submitBtn = this.querySelector('#submit');
  }

  _attachEventHandlers() {
    this._submitBtn.addEventListener('click', this._onSubmit);
  }

  _onSubmit = (event) => {
    const notValid = inputNotValid(this._startDate) || inputNotValid(this._endDate) || inputNotValid(this._location) || inputNotValid(this._name);
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
