import template from "./trip-list.component.html";
import styles from './trip-list.component.scss';
import WebComponent from "../../base/web-component";
export default class TripListComponent extends WebComponent {

  static SELECTOR = "trip-list";

  _html = template;
  _styles = styles;
  _list;

  constructor() {
    super();
    this._init();
  }

  static define() {
    super.define(TripListComponent);
  }

  static _makeListEl({id ,name, location, start, end}) {
    const listEl = document.createElement("li");
    listEl.innerHTML = `<p><strong>${name}</strong></p><p>${location} (${start} - ${end})</p><button data-id=${id}>&#10005;</button>`;
    listEl.classList.add("list__item");
    listEl.setAttribute('data-id', id);
    return listEl;
  }

  add({ id, name, location, start, end }) {
    const listEl = this._makeListEl(id, name, location, start, end);
    this._list.appendChild(listEl);
  }

  updateProps(trips) {
    const fragment = document.createDocumentFragment();
    trips.forEach(trip => {
      const listEl = TripListComponent._makeListEl(trip.general);
      fragment.appendChild(listEl);
    })
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
    let tripId;
    if (target.nodeName === 'BUTTON') {
      tripId = target.attributes['data-id'].value;
      const removeEvent = new CustomEvent('remove', { detail: tripId });
      this.dispatchEvent(removeEvent);
      this._list.removeChild(target.parentNode);
    } else {
      tripId = target.parentNode.attributes['data-id'].value;
      const viewEvent = new CustomEvent('view', { detail: tripId });
      this.dispatchEvent(viewEvent);
    }
  };
}
