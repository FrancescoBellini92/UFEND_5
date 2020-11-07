import DynamicWebComponent from '../../base/dynamic.web.component';
import Trip from '../../models/trip.model';
import * as moment from 'moment';
import { show, hide } from '../../DOM-utils/DOM-utils';
import { CardRemoveEvent, CardViewEvent } from "../../models/events";
import { Component } from "../../base/decorators";

const template: string = require('./trip-card.component.html') ;
const style: { default: string } = require('./trip-card.component.scss');

@Component({
  selector:"trip-card",
  template,
  hasShadow: true,
  style
})
export default class TripCardComponent extends DynamicWebComponent {

  private static _PICTURE_ID  = 'picture';

  private _startDate: HTMLElement;
  private _endDate: HTMLElement;
  private _location: HTMLElement;
  private _name: HTMLElement;

  private _trip: Trip;

  private _pictureContainer: any;

  private _handlersMap = {
    'remove': () => {
      const removeEvent = new CardRemoveEvent('remove', { detail: this._trip.general.id , bubbles: true });
      hide(this);
      this.dispatchEvent(removeEvent);
    },
    'view': () => {
      const viewEvent = new CardViewEvent('view', { detail: this._trip , bubbles: true});
      this.dispatchEvent(viewEvent);
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
    const { id, name, location, start, end } = this._trip.general;
    const pix = this._trip.pix.webformatURL;
    this._name.textContent = name;
    this._location.textContent = `${location} - ${this._trip.geo.countryName}`;
    this._startDate.textContent = moment(start).format('L');
    this._endDate.textContent = moment(end).format('L');
    const img = this.shadowRoot.querySelector(`#${TripCardComponent._PICTURE_ID}`) ?? document.createElement('img');
    if (pix) {
      img.id = TripCardComponent._PICTURE_ID;
      img.classList.add('card__img');
      img['src'] = pix;
      this._pictureContainer.appendChild(img);
    } else {
      img.remove();
    }
  }

  protected _queryTemplate(): void {
    this._startDate = this._shadowRoot.querySelector('#start-date');
    this._endDate = this._shadowRoot.querySelector('#end-date');
    this._location = this._shadowRoot.querySelector('#location');
    this._name = this._shadowRoot.querySelector('#name');
    this._pictureContainer = this._shadowRoot.querySelector('#picture-container');
  }

  protected _attachEventHandlers(): void {
    this._shadowRoot.addEventListener('click', this._onClick )
  }

  private _onClick = (e: Event) => {
    const target = e.target as HTMLElement;
    const handlerFn = this._handlersMap[target.id];
    handlerFn();
  };
}
