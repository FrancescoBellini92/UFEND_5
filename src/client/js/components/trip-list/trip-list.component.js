import template from "./trip-list.component.html";
import styles from './trip-list.component.scss';
import WebComponent from "../../base/web-component";

export default class TripListComponent extends WebComponent {

  static SELECTOR = "trip-list";

  _html = template;
  _styles = styles;
  _list;

  data = [];

  makeListStrategyFn;

  canRemove;

  constructor() {
    super();
    this._init();
  }

  static define() {
    super.define(TripListComponent);
  }

  add(item) {
    this.data.unshift(item);
    const listEl = this._makeListEl(item);
    this._list.appendChild(listEl);
  }

  addMany(data) {
    this.data = data;
    const fragment = document.createDocumentFragment();
    data.forEach((item, index) => {
      const listEl = this._makeListEl(item, index);
      fragment.appendChild(listEl);
    });
    this._list.innerHTML = '';
    this._list.appendChild(fragment);
  }

  _queryTemplate() {
    this._list = this.shadowRoot.querySelector("#list");
  }

  _attachEventHandlers() {
    this._list.addEventListener('click', this._onClick);
  }

  _onClick = (e) => {
    const target = e.target;
    let idToRemove;
    if (target.nodeName === 'BUTTON') {
      idToRemove = target.parentElement.attributes['data-id'].value;
      this.data.splice(idToRemove,1);
      const removeEvent = new CustomEvent('remove', { detail: { idToRemove, element: this } });
      this.dispatchEvent(removeEvent);
      this._list.removeChild(target.parentNode);
    } 
  }

    _makeListEl(item, index) {
      const listEl = document.createElement("li");
      listEl.innerHTML = 
      listEl.innerHTML = this.makeListStrategyFn(item);
      listEl.classList.add("list__item");
      listEl.setAttribute('data-id', index);
      return listEl;
  }

}
