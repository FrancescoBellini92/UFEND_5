import DynamicWebComponent from '../../base/dynamic.web.component';
import { inputNotValid } from '../../DOM-utils/DOM-utils';
import { SubmitTripEvent } from '../../models/events';
import { Component } from '../../base/component';
import TripRequest from '../../models/trip.request';
import moment from 'moment';
import ToastService from '../../services/toast.service';
import { Inject } from '../../base/inject';
import { Child } from '../../base/child';
import { Effect } from '../../base/effect';

const template: string = require('./trip-form.component.html');
const style: { default: string } = require('./trip-form.component.scss');

@Inject(
  {
    injectionToken: ToastService,
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

  public nameObj = {name: 'default name'};


  @Effect()
  public ifBoundValue = false;

  @Effect()
  public forBoundValue = [1,2,3];

  @Child('#start-date')
  private _startDateInput: HTMLInputElement;

  @Child('#end-date')
  private _endDateInput: HTMLInputElement;

  @Child('#location')
  private _locationInput: HTMLInputElement;

  @Child('#name')
  private _nameInput: HTMLInputElement;

  @Child('#submit')
  private _submitBtn: HTMLInputElement;

  private _toastService: ToastService;

  constructor() {
    super();
    setInterval(() => this.ifBoundValue = !this.ifBoundValue, 1000)
    setInterval(() => {
      if (this.forBoundValue) {
        this.forBoundValue = this.forBoundValue.concat(4);
      }}, 5000)
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
