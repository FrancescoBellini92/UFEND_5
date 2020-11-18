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
  hasShadowDom: true,
  style
})
export default class TripListComponent extends DynamicWebComponent {

  data: any[] = [];

  makeListStrategyFn: { (item: any): string } = item => '';

  private _listEl: HTMLElement;
  private _toggleBtn: HTMLElement;

  constructor() {
    super();
  }

  add(item: any): void {
    this.data.push(item);
    const listEl = this._makeListEl(item, this.data.length);
    this._listEl.appendChild(listEl);
  }

  addMany(data: any[]): void {
    if (TripService.isEmpty(data)) {
      this._listEl.innerHTML = '<li class="list__item">Sorry, there is no data available</li>';
      return;
    }
    this.data = data;
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
    this._toggleBtn = this.shadowRoot.querySelector("#toggle-btn");
  }

  protected _attachEventHandlers(): void {
    this._toggleBtn.addEventListener('click', e => this._onClick(e));
  }

  private _onClick(e: Event): void {
    if (this._listEl.className.includes('open')) {
      removeClass('open', this._listEl);
      this._toggleBtn.textContent = 'Open';
      return;
    }
    addClass('open', this._listEl);
    this._toggleBtn.textContent = 'Close';
  }

  private _makeListEl(item: any, index: any) {
    const listEl = document.createElement("li");
    listEl.innerHTML = this.makeListStrategyFn(item);
    listEl.classList.add("list__item");
    listEl.setAttribute('data-id', index);
    return listEl;
  }

}
