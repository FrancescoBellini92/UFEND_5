import DynamicWebComponent from '../../base/dynamic.web.component';
import { inputNotValid } from '../../DOM-utils/DOM-utils';
import { SubmitTripEvent } from '../../models/events';
import { Component } from '../../base/component';
import TripRequest from '../../models/trip.request';
import moment from 'moment';
import ToastService from '../../services/toast.service';
import { Inject } from '../../base/inject';

const template: string = require('./trip-form.component.html');
const style: { default: string } = require('./trip-form.component.scss');

@Inject(
  {
    injectionToken: ToastService.injectionToken,
    nameAsDependency: '_toastService'
  },
)
@Component({
  selector: "trip-form",
  template,
  hasShadowDom: true,
  style
})
export default class TripFormComponent extends DynamicWebComponent {

  private _startDateInput: HTMLInputElement;
  private _endDateInput: HTMLInputElement;
  private _locationInput: HTMLInputElement;
  private _nameInput: HTMLInputElement;
  private _submitBtn: HTMLInputElement;

  private _toastService: ToastService;

  constructor() {
    super();
  }

  reset(): void {
    this._startDateInput.value = null;
    this._endDateInput.value = null;
    this._locationInput.value = null;
    this._nameInput.value = null;
  }

  updateProps(tripRequest: TripRequest): void {
    const { name, start, end, location } = tripRequest;
    this._nameInput.value = name;
    this._startDateInput.value = start;
    this._endDateInput.value = end;
    this._locationInput.value = location;
  }

  protected _queryTemplate(): void {
    this._startDateInput = this.shadowRoot.querySelector('#start-date');
    this._endDateInput = this.shadowRoot.querySelector('#end-date');
    this._locationInput = this.shadowRoot.querySelector('#location');
    this._nameInput = this.shadowRoot.querySelector('#name');
    this._submitBtn = this.shadowRoot.querySelector('#submit');
  }

  protected _attachEventHandlers(): void {
    this._submitBtn.addEventListener('click', e => this._onSubmit(e));
  }

  private _onSubmit(e: Event): void {
    const start: string =  this._startDateInput.value;
    const end: string =  this._endDateInput.value;
    const location: string =  this._locationInput.value;
    const name: string =  this._nameInput.value;

    const startDate = moment(this._startDateInput.value);
    const endDate = moment(this._endDateInput.value);
    const datesNotCorrect = !(startDate.isSameOrBefore(endDate) && endDate.isSameOrAfter(startDate));

    const locationAndNameNotValid = inputNotValid(location) || inputNotValid(name);

    if (locationAndNameNotValid || datesNotCorrect) {
      this._manageValidationErrors(locationAndNameNotValid, datesNotCorrect, e);
      return;
    }

    e.preventDefault();
    this._emitSubmit({ start, end, location, name });
  }

  private _manageValidationErrors(locationAndNameNotValid: boolean, datesNotCorrect: boolean, e: Event): void {
    if (datesNotCorrect && !locationAndNameNotValid) {
      this._toastService.showDanger('Dates are not correct');
      e.preventDefault();
    }
  }

  private _emitSubmit(detail: TripRequest): void {
    const submitEvent = new SubmitTripEvent('submit', {
      detail,
      bubbles: true
    });
    this.dispatchEvent(submitEvent);
  }
}
