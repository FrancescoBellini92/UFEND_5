import template from "./trip-list.component.html";
import styles from './trip-list.component.scss';
import WebComponent from "../../base/web.component";
import TripService from "../../services/trip.service";
import { addClass, removeClass, show } from "../../DOM-utils/DOM-utils";

export default class TripListComponent extends WebComponent {

  static SELECTOR = "trip-list";

  data = [];

  makeListStrategyFn;


  _html = template;
  _styles = styles;
  _listEl;
  _titleEl;

  _isCollapsed = true;

  constructor() {
    super();
    this._init();
  }

  static define() {
    super.define(TripListComponent);
  }

  get title() {
    return this._title;
  }

  set title(val) {
    this._titleEl.textContent = val;
    show(this._titleEl);
  }

  add(item) {
    this.data.unshift(item);
    const listEl = this._makeListEl(item);
    this._listEl.appendChild(listEl);
  }

  addMany(data) {
    this.data = data;
    if (TripService.isEmpty(this.data)) {
      this._listEl.innerHTML = '<li class="list__item">Sorry, there is no data available</li>';
      return;
    }
    const fragment = document.createDocumentFragment();
    data.forEach((item, index) => {
      const listEl = this._makeListEl(item, index);
      fragment.appendChild(listEl);
    }); 
    this._listEl.innerHTML = '';
    this._listEl.appendChild(fragment);
  }

  _queryTemplate() {
    this._listEl = this.shadowRoot.querySelector("#list");
    this._titleEl = this.shadowRoot.querySelector("#title");
  }

  _attachEventHandlers() {
    this.shadowRoot.addEventListener('click', this._onClick);
  }

  _onClick = (e) => {
    const target = e.target;
    let idToRemove;
    if (target.nodeName === 'BUTTON') {
      idToRemove = target.parentElement.attributes['data-id'].value;
      this.data.splice(idToRemove,1);
      const removeEvent = new CustomEvent('remove', { detail: { idToRemove, element: this } });
      this.dispatchEvent(removeEvent);
      this._listEl.removeChild(target.parentNode);
    }
    if (target.nodeName === 'H2') {
      debugger;
      this._listEl.className.includes('open') ? removeClass('open', this._listEl) : addClass('open', this._listEl);
    } 
  }

  _makeListEl(item, index) {
    const listEl = document.createElement("li");
    listEl.innerHTML = this.makeListStrategyFn(item);
    listEl.classList.add("list__item");
    listEl.setAttribute('data-id', index);
    return listEl;
  }

}
