import DynamicWebComponent from '../../base/dynamic.web.component';
import { inputNotValid } from '../../DOM-utils/DOM-utils';
import { AddFormSubmitEvent } from '../../models/events';
import { Component } from '../../base/decorators';

const template: string = require('./trip-form.component.html');
const style: { default: string } = require('./trip-form.component.scss');

@Component({
  selector: "trip-form",
  template,
  hasShadow: true,
  style
})
export default class TripFormComponent extends DynamicWebComponent {

  private _startDate: HTMLInputElement;
  private _endDate: HTMLInputElement;
  private _location: HTMLInputElement;
  private _name: HTMLInputElement;
  private _submitBtn: HTMLInputElement;

  constructor() {
    super();
  }

  reset(): void {
    this._startDate.value = null;
    this._endDate.value = null;
    this._location.value = null;
    this._name.value = null;
  }

  protected _queryTemplate(): void {
    this._startDate = this.shadowRoot.querySelector('#start-date');
    this._endDate = this.shadowRoot.querySelector('#end-date');
    this._location = this.shadowRoot.querySelector('#location');
    this._name = this.shadowRoot.querySelector('#name');
    this._submitBtn = this.shadowRoot.querySelector('#submit');
  }

  protected _attachEventHandlers(): void {
    this._submitBtn.addEventListener('click', this._onSubmit);
  }

  private _onSubmit = (e: Event) => {
    const notValid = inputNotValid(this._startDate) || inputNotValid(this._endDate) || inputNotValid(this._location) || inputNotValid(this._name);
    if (notValid) {
      return;
    }
    e.preventDefault();
    this._emitSubmit();
  }

  private _emitSubmit(): void {
    const submitEvent = new AddFormSubmitEvent('submit', {
      detail: {
        startDate: this._startDate.value,
        endDate: this._endDate.value,
        location: this._location.value,
        name: this._name.value
      },
      bubbles: true
    });
    this.dispatchEvent(submitEvent);
  }



}
