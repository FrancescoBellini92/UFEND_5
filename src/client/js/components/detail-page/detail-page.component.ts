import DynamicWebComponent from '../../base/dynamic.web.component';
import TripCardComponent from '../trip-card/trip-card.component';
import { hide, show } from "../../DOM-utils/DOM-utils";
import Trip from "../../models/trip.model";
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
    this._weatherList.addMany(trip.weather);
  }

  protected _queryTemplate(): void {
    this._detailTitle = document.getElementById('detail-title');
    this._detailCard = document.getElementById('detail-card') as TripCardComponent;
    this._weatherList = document.getElementById('weather-list') as TripListComponent;
    this._removedAlert = document.getElementById('detail-deleted');

    this._detailCard.hideChildren('#view');
    this._weatherList.title = 'Weather forecast';
    this._weatherList.makeListStrategyFn = ({ valid_date, temp, weather }) => `<p><strong>${moment(valid_date).format('L')}</strong></p><p>${weather.description} - ${temp} °C</p><button>&#10005;</button>`;
  }

  protected _attachEventHandlers(): void {
    this._detailCard.addEventListener('remove', () => this._onRemove());
    this.addEventListener('edit', () => navigateTo('#edit'));
    // this._weatherList.addEventListener('remove', this._onRemove);
  }

  private _onRemove(): void {
    const tripId = this._tripService.currentTrip.general.id;
    this._tripService.currentTrip = null;
    this._tripService.delete(tripId)
    // TODO: create header component to manage this
    hide(document.getElementById('detail-anchor'));
    hide(this._detailTitle);
    hide(this._weatherList);
    show(this._removedAlert);
  }
}
