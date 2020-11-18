import DynamicWebComponent from '../../base/dynamic.web.component';
import { inputNotValid } from '../../DOM-utils/DOM-utils';
import { SubmitTripEvent } from '../../models/events';
import { Component } from '../../base/decorators';
import TripRequest from '../../models/trip.request';

const template: string = require('./trip-form.component.html');
const style: { default: string } = require('./trip-form.component.scss');

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
    const notValid = inputNotValid(this._startDateInput) || inputNotValid(this._endDateInput) || inputNotValid(this._locationInput) || inputNotValid(this._nameInput);
    if (notValid) {
      return;
    }
    e.preventDefault();
    this._emitSubmit();
  }

  private _emitSubmit(): void {
    const submitEvent = new SubmitTripEvent('submit', {
      detail: {
        start: this._startDateInput.value,
        end: this._endDateInput.value,
        location: this._locationInput.value,
        name: this._nameInput.value
      },
      bubbles: true
    });
    this.dispatchEvent(submitEvent);
  }
}
