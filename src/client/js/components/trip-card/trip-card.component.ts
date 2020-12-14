import DynamicWebComponent from '../../base/dynamic.web.component';
import Trip from '../../models/trip.model';
import * as moment from 'moment';
import { show, hide, addClass, removeClass } from '../../DOM-utils/DOM-utils';
import { RemoveTripEvent, SelectTripEvent } from "../../models/events";
import { Component } from "../../base/component";

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
      requestAnimationFrame(() => hide(this));
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
    requestAnimationFrame(() => hide(element));
  }

  updateProps(trip: Trip) {
    this._trip = trip;
    const pix = this._trip.pix.webformatURL;
    const { name, location, start, end } = this._trip.general;

    this._name.textContent = name;
    this._location.textContent = `${location} - ${this._trip.geo.countryName}`;
    this._startDate.textContent = moment(start).format('L');
    this._endDate.textContent = moment(end).format('L');

    this._addPicture(pix);
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

  private _addPicture(pix: string): void {
    const img = (this.shadowRoot.querySelector(`#${TripCardComponent._PICTURE_ID}`) ?? document.createElement('img')) as HTMLImageElement;
    img.id = TripCardComponent._PICTURE_ID;
    img.src = pix;
    img.alt = 'Travel picture';
    img.classList.add('card__img', 'can-hide-present', 'hidden');
    img.addEventListener('error', () => img.src = TripCardComponent._DEFAULT_IMG_PATH);
    img.addEventListener('load', () => removeClass('hidden', img));
    requestAnimationFrame(() => this._pictureContainer.appendChild(img));
  }

  private _onClick(e: Event): void {
    const target = e.target as HTMLElement;
    const handlerFn = this._handlersMap[target.id]?.call();
    if (handlerFn) {
      handlerFn();
    }
  };
}
