import tripListTemplate from "./trip-list.component.html";
import { $, inputNotValid } from "../../DOM-utils/DOM-utils";
import { WebComponent } from "../../base/web-component";
export default class TripListComponent extends WebComponent {

  static SELECTOR = "trip-list";

  _html = tripListTemplate;
  _list;

  constructor() {
    super();
    this._init();
    this._queryTemplate();
  }

  static define() {
    super.define(TripListComponent);
  }

  static _makeListEl({name, location, start, end}) {
    const listEl = document.createElement("li");
    listEl.innerHTML = `<p><strong>${name}</strong></p><p>${location} (${start} - ${end})</p>`;
    listEl.classList.add("list__item");
    return listEl;
  }

  update({ name, location, start, end }) {
    debugger;
    const listEl = this._makeListEl(name, location, start, end);
    this._list.appendChild(listEl);
  }

  updateMany(trips) {
    debugger;
    const fragment = document.createDocumentFragment();
    trips.forEach(trip => {
      const listEl = TripListComponent._makeListEl(trip.general);
      fragment.appendChild(listEl);
    })
    this._list.appendChild(fragment);
  }

  _queryTemplate() {
    this._list = $("#list");
  }

}
