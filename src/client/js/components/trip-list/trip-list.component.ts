import DynamicWebComponent from "../../base/dynamic.web.component";
import TripService from "../../services/trip.service";
import { addClass, removeClass, show } from "../../DOM-utils/DOM-utils";
import { Component } from "../../base/component";
import moment from "moment";
import { DayInfo } from "../../models/trip.model";
import getWeatherIcon from "../detail-page/weather-icons";

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
    requestAnimationFrame(() => this._listEl.appendChild(listEl));
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
    requestAnimationFrame(() => this._listEl.appendChild(fragment));
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

  private _makeListEl(dayInfo: DayInfo, index: number) {
    const listEl = document.createElement("li");
    listEl.innerHTML = this._buildElementHTML(dayInfo);
    listEl.classList.add("list__item");
    listEl.setAttribute('data-id', index.toString());
    return listEl;
  }

  private _buildElementHTML(dayInfo: DayInfo): string {
    const { weather, details } = dayInfo;
    let weatherHTML = '';

    if (weather) {
      weatherHTML = `
      <div class="row">
        <strong>${moment(weather.valid_date).format('L')}</strong>
        <img class="list__image" src="${getWeatherIcon(weather)}"/>
      </div>
      <p><em>Weather:</em> ${weather.weather.description} - ${weather.temp} °C</p>
      `
    }

    const detailsHTML = [];
    details?.forEach(detail => {
      const detailHTML = `
      <li class="margin-small">
        <strong>${moment(detail.date).format('HH:mm')}</strong> - <em>${detail.type.toLowerCase()}</em><span>: ${detail.content}
      </li>`
      detailsHTML.push(detailHTML);
    });

    return details ? `${weatherHTML}<p><em>Planning</em></p><ul>${detailsHTML.join('')}</ul>` : `${weatherHTML}<p>`;
  }

}
