import template from "./trip-form.component.html";
import styles from './trip-form.component.scss';
import { inputNotValid } from '../../DOM-utils/DOM-utils';
import WebComponent from '../../base/web-component';

// function testDecorator(target, name, descriptor) {
//   debugger;
// }
// @testDecorator()
export default class TripFormComponent extends WebComponent {

  static SELECTOR = "trip-form";


  _html = template;
  _styles = styles;

  _startDate;
  _endDate;
  _location;
  _name;
  _submitBtn;

  constructor() {
    super();
    this._init();
  }

  static define() {
    super.define(TripFormComponent);
  }

  reset() {
    this._startDate.value = null;
    this._endDate.value = null;
    this._location.value = null;
    this._name.value = null;
  }
  
  _queryTemplate() {
    this._startDate = this.shadowRoot.querySelector('#start-date');
    this._endDate = this.shadowRoot.querySelector('#end-date');
    this._location = this.shadowRoot.querySelector('#location');
    this._name = this.shadowRoot.querySelector('#name');
    this._submitBtn = this.shadowRoot.querySelector('#submit');

    this._endDate.setAttribute('min', new Date().toISOString());
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
