import DynamicWebComponent from '../../base/dynamic.web.component';
import Trip from '../../models/trip.model';
import * as moment from 'moment';
import { show, hide } from '../../DOM-utils/DOM-utils';
import { RemoveTripEvent, SelectTripEvent } from "../../models/events";
import { Component } from "../../base/decorators";

const template: string = require('./trip-card.component.html') ;
const style: { default: string } = require('./trip-card.component.scss');

@Component({
  selector:"trip-card",
  template,
  hasShadowDom: true,
  style
})
export default class TripCardComponent extends DynamicWebComponent {

  private static _PICTURE_ID  = 'picture';
  private static _DEFAULT_IMG_PATH = '/src/assets/images/default.jpg';

  private _startDate: HTMLElement;
  private _endDate: HTMLElement;
  private _location: HTMLElement;
  private _name: HTMLElement;

  private _trip: Trip;

  private _pictureContainer: any;

  private _handlersMap = {
    'remove': () => {
      const removeEvent = new RemoveTripEvent('remove', { detail: this._trip.id , bubbles: true });
      hide(this);
      this.dispatchEvent(removeEvent);
    },
    'view': () => {
      const viewEvent = new SelectTripEvent('view', { detail: this._trip.id , bubbles: true});
      this.dispatchEvent(viewEvent);
    },
    'edit': () => {
      const editEvent = new SelectTripEvent('edit', { detail: this._trip.id , bubbles: true});
      this.dispatchEvent(editEvent);
    }
  }

  constructor() {
    super();
  }

  hideChildren(selector: string): void {
    const element = this.shadowRoot.querySelector(selector);
    hide(element);
  }

  showChildren(selector: string): void {
    const element = this.shadowRoot.querySelector(selector);
    show(element);
  }

  updateProps(trip: Trip) {
    this._trip = trip;
    const { name, location, start, end } = this._trip.general;
    const pix = this._trip.pix.webformatURL;
    this._name.textContent = name;
    this._location.textContent = `${location} - ${this._trip.geo.countryName}`;
    this._startDate.textContent = moment(start).format('L');
    this._endDate.textContent = moment(end).format('L');
    const img = (this.shadowRoot.querySelector(`#${TripCardComponent._PICTURE_ID}`) ?? document.createElement('img')) as HTMLImageElement;
    img.id = TripCardComponent._PICTURE_ID;
    img.classList.add('card__img');
    img.src=pix;
    img.addEventListener('error', () => img.src = TripCardComponent._DEFAULT_IMG_PATH);
    this._pictureContainer.appendChild(img);
  }

  protected _queryTemplate(): void {
    this._startDate = this._shadowRoot.querySelector('#start-date');
    this._endDate = this._shadowRoot.querySelector('#end-date');
    this._location = this._shadowRoot.querySelector('#location');
    this._name = this._shadowRoot.querySelector('#name');
    this._pictureContainer = this._shadowRoot.querySelector('#picture-container');
  }

  protected _attachEventHandlers(): void {
    this._shadowRoot.addEventListener('click', e => this._onClick(e) )
  }

  private _onClick(e: Event): void {
    const target = e.target as HTMLElement;
    const handlerFn = this._handlersMap[target.id];
    handlerFn();
  };
}
