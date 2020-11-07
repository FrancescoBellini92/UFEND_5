import DynamicWebComponent from "../../base/dynamic.web.component";
import TripService from "../../services/trip.service";
import { addClass, removeClass, show } from "../../DOM-utils/DOM-utils";
import { RemoveListItemEvent } from "../../models/events";
import { Component } from "../../base/decorators";

const template = require("./trip-list.component.html");
const style = require('./trip-list.component.scss');

@Component({
  selector: 'trip-list',
  template,
  hasShadow: true,
  style
})
export default class TripListComponent extends DynamicWebComponent {

  data: any[] = [];

  makeListStrategyFn: { (item: any): string } = item => '';

  private _listEl: HTMLElement;
  private _titleEl: HTMLElement;

  constructor() {
    super();
  }

  set title(val: string) {
    this._titleEl.textContent = val;
    show(this._titleEl);
  }

  add(item: any): void {
    this.data.push(item);
    const listEl = this._makeListEl(item, this.data.length);
    this._listEl.appendChild(listEl);
  }

  addMany(data: any[]): void {
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

  protected _queryTemplate(): void {
    this._listEl = this.shadowRoot.querySelector("#list");
    this._titleEl = this.shadowRoot.querySelector("#title");
  }

  protected _attachEventHandlers(): void {
    this.shadowRoot.addEventListener('click', e => this._onClick(e));
  }

  private _onClick(e: Event): void {
    const target = e.target as HTMLElement;
    let idToRemove: number;
    if (target.nodeName === 'BUTTON') {
      idToRemove = target.parentElement.attributes['data-id'].value;
      this.data.splice(idToRemove,1);
      const removeEvent = new RemoveListItemEvent('remove',{ detail: { idToRemove, element: this } }  );
      this.dispatchEvent(removeEvent);
      this._listEl.removeChild(target.parentNode);
    }
    if (target.nodeName === 'H2') {
      this._listEl.className.includes('open') ? removeClass('open', this._listEl) : addClass('open', this._listEl);
    }
  }

  private _makeListEl(item, index) {
    const listEl = document.createElement("li");
    listEl.innerHTML = this.makeListStrategyFn(item);
    listEl.classList.add("list__item");
    listEl.setAttribute('data-id', index);
    return listEl;
  }

}
