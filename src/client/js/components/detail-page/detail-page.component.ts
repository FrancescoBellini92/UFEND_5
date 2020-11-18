import DynamicWebComponent from '../../base/dynamic.web.component';
import TripCardComponent from '../trip-card/trip-card.component';
import { hide, show } from "../../DOM-utils/DOM-utils";
import Trip, { DayInfo } from "../../models/trip.model";
import { Component } from "../../base/decorators";
import { Inject } from "../../base/inject";
import TripService from "../../services/trip.service";
import { RemoveTripEvent, SelectTripEvent } from "../../models/events";
import TripListComponent from "../trip-list/trip-list.component";
import moment from "moment";
import { navigateTo, Routable } from '../../base/router';

const template: string = require("./detail-page.component.html");

@Inject({
  injectionToken: TripService.injectionToken,
  nameAsDependency: '_tripService'
})
@Component({
  selector:"detail-page",
  template,
  route: '#details'
})
export default class DetailPageComponent extends DynamicWebComponent implements Routable{

  private _detailTitle: HTMLElement;
  private _detailCard: TripCardComponent;
  private _weatherList: TripListComponent;
  private _removedAlert: HTMLElement;

  private _tripService: TripService;

  constructor() {
    super();
    this._tripService.currentTrip$.subscribe((trip: Trip) => this.updateProps(trip));
  }

  static define(): void {
    super.define();
  }

  show(): void {
    show(this.firstElementChild);
  }

  hide(): void {
    hide(this.firstElementChild);
  }

  updateProps(trip: Trip): void {
    this._detailCard.updateProps(trip);
    this._weatherList.addMany(TripService.getDayInfo(trip));
  }

  protected _queryTemplate(): void {
    this._detailTitle = document.getElementById('detail-title');
    this._detailCard = document.getElementById('detail-card') as TripCardComponent;
    this._weatherList = document.getElementById('weather-list') as TripListComponent;
    this._removedAlert = document.getElementById('detail-deleted');

    this._detailCard.hideChildren('#view');
    this._weatherList.title = 'Trip details';
    this._weatherList.makeListStrategyFn = (dayData: DayInfo) => {
      const { weather, details } = dayData;
      let weatherHTML = '';
      if( weather) {
        weatherHTML = `
        <span><strong>${moment(weather.valid_date).format('L')}</strong></span><span>${weather.weather.description} - ${weather.temp} °C</span>`
      }
      const detailsHTML = [];
      details?.forEach(detail => {
        const detailHTML = `
        <li class="margin-small"><strong>${moment(detail.date).format('HH:mm')}</strong> - <em>${detail.type.toLowerCase()}</em><span>: ${detail.content}</li>`
        detailsHTML.push(detailHTML);
      });

      const itemHTML = `<div class="margin-small row">${weatherHTML}</div><ul>${detailsHTML.join('')}</ul>`
      return itemHTML;
    }
  }

  protected _attachEventHandlers(): void {
    this._detailCard.addEventListener('remove', () => this._onRemove());
    this.addEventListener('edit', () => navigateTo('#edit'));
    // this._weatherList.addEventListener('remove', this._onRemove);
  }

  private _onRemove(): void {
    const tripId = this._tripService.currentTrip.id;
    this._tripService.currentTrip = null;
    this._tripService.delete(tripId)
    // TODO: create header component to manage this
    hide(document.getElementById('detail-anchor'));
    hide(this._detailTitle);
    hide(this._weatherList);
    show(this._removedAlert);
  }
}
