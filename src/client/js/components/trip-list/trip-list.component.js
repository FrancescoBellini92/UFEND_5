import tripFormTemplate from './trip-form.component.html';
import { $, inputNotValid } from '../../DOM-utils/DOM-utils';
import { WebComponent } from '../../base/web-component';
export default class TripListComponent extends WebComponent {

  _html = tripFormTemplate;

  _startDate;
  _endDate;
  _location;
  _submitBtn;

  constructor() {
    super();
    this._init();
    this._queryTemplate();
    this._submitBtn.addEventListener('click', this._onSubmit)
  }

  _queryTemplate() {
    this._startDate = $('#startDate');
    this._endDate = $('#endDate');
    this._location = $('#location');
    this._submitBtn = $('#submit');
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
      location: this._location.value
    };
    const onSubmit = new CustomEvent('submit', {detail: eventBody });
    this.dispatchEvent(onSubmit);
  }

  reset() {
    this._startDate.value = this._endDate.value = this._location.value = null;
  }

  static define() {
    super.define('trip-form', TripFormComponent);
  }

}