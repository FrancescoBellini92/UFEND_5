import tripFormTemplate from './trip-form.component.html';
import { $, inputNotValid } from '../../DOM-utils/DOM-utils';
// class ComponentEvent {
//   constructor(eventName, eventTarget, eventData, eventHandler) {
//     this.eventName = eventName;
//     this.eventTarget = eventTarget;
//     this.eventData = eventData;
//     this.callback = eventHandler;
//   }

//   _init() {
//     const event = new CustomEvent(this.eventName, )
//     this.eventTarget.addEventListener(this.eventName, )
//   }
// }

class WebComponent extends HTMLElement {

  _html;
  _shadowRoot;
  // _customEvents = [];
  
  constructor() {
    super();
  }

  _init() {
    this._attachShadowRoot();
    this._attachHTML();
  }

  _attachShadowRoot() {
    this._shadowRoot = this.attachShadow({mode: 'open'});
  }

  _attachHTML() {
    this._shadowRoot.innerHTML = this._html;
  }


  // _defineCustomEvents() {
  //   const events = []
  // }

  static define(selector, className) {
    customElements.define(selector, className);
  }
}

export default class TripFormComponent extends WebComponent {

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
    this._startDate = $('#startDate', this.shadowRoot);
    this._endDate = $('#endDate', this.shadowRoot);
    this._location = $('#location', this.shadowRoot);
    this._submitBtn = $('#submit', this.shadowRoot);
  }
  
  _onSubmit = (event) => {
    const notValid = inputNotValid(this._startDate) || inputNotValid(this._endDate) || inputNotValid(this._location);
    if (notValid) {
      return;
    }
    event.preventDefault();
    console.log(this._startDate.value, this._endDate.value, this._location.value);
    this._reset();
    console.log(this._startDate.value, this._endDate.value, this._location.value);    
  }

  _reset() {
    this._startDate.value = this._endDate.value = this._location.value = null;
  }

  static define() {
    super.define('trip-form', TripFormComponent);
  }

}
