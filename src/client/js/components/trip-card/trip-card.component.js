import template from './trip-card.component.html';
import styles from './trip-card.component.scss';
import WebComponent from '../../base/web-component';
import Trip from '../../models/trip.model';
import * as moment from 'moment';
import { show, hide } from './../../DOM-utils/DOM-utils';


// function testDecorator(target, name, descriptor) {
//   debugger;
// }
// @testDecorator()
export default class TripCardComponent extends WebComponent {

  static SELECTOR = "trip-card";
  static _PICTURE_ID  = 'picture';

  _html = template;
  _styles = styles;

  _startDate;
  _endDate;
  _location;
  _name;

  _trip;
  

  _handlersMap = {
    'remove': () => {
      const removeEvent = new CustomEvent('remove', { detail: { id: this._trip.general.id, element: this }, bubbles: true });
      this.dispatchEvent(removeEvent);
    },
    'view': () => {
      const viewEvent = new CustomEvent('view', { detail: {trip: this._trip, element: this}, bubbles: true});
      this.dispatchEvent(viewEvent);
    }
  }

  constructor() {
    super();
    this._init();
  }

  static define() {
    super.define(TripCardComponent);
  }

  hideChildren(selector) {
    const element = this.shadowRoot.querySelector(selector);
    hide(element);
  }

  showChildren(selector) {
    const element = this.shadowRoot.querySelector(selector);
    show(element);
  }

  updateProps(tripData) {
    this._trip = new Trip(tripData);
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
      img.src = pix;
      this._pictureContainer.appendChild(img);
    } else {
      img.remove();
    }
  }
  
  _queryTemplate() {
    this._startDate = this._shadowRoot.querySelector('#start-date');
    this._endDate = this._shadowRoot.querySelector('#end-date');
    this._location = this._shadowRoot.querySelector('#location');
    this._name = this._shadowRoot.querySelector('#name');
    this._pictureContainer = this._shadowRoot.querySelector('#picture-container');
  }

  _attachEventHandlers() {
    this._shadowRoot.addEventListener('click', this._onClick )
  }

  _onClick = (e) => {
    const target = e.target;
    const handlerFn = this._handlersMap[target.id];
    handlerFn();
  };
}
