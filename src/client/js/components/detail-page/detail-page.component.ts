import DynamicWebComponent from '../../base/dynamic.web.component';
import TripCardComponent from '../trip-card/trip-card.component';
import { hide, show } from "../../DOM-utils/DOM-utils";
import Trip, { DayInfo, Weather } from "../../models/trip.model";
import { Component } from "../../base/decorators";
import { Inject } from "../../base/inject";
import TripService from "../../services/trip.service";
import TripListComponent from "../trip-list/trip-list.component";
import moment from "moment";
import { navigateTo, Routable } from '../../base/router';
import ToastService from '../../services/toast.service';
import getWeatherIcon from './weather-icons';
import DialogService from '../../services/dialog.service';

const template: string = require("./detail-page.component.html");

@Inject(
  {
    injectionToken: TripService.injectionToken,
    nameAsDependency: '_tripService'
  },
  {
    injectionToken: ToastService.injectionToken,
    nameAsDependency: '_toastService'
  },
  {
    injectionToken: DialogService.injectionToken,
    nameAsDependency: '_dialogService'
  }
)
@Component({
  selector:"detail-page",
  template,
  route: '#details'
})
export default class DetailPageComponent extends DynamicWebComponent implements Routable{

  private _detailCard: TripCardComponent;
  private _weatherList: TripListComponent;

  private _tripService: TripService;
  private _toastService: ToastService;
  private _dialogService: DialogService;

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
    this._detailCard = document.getElementById('detail-card') as TripCardComponent;
    this._weatherList = document.getElementById('weather-list') as TripListComponent;

    this._detailCard.hideChildren('#view');
    this._weatherList.title = 'Trip details';
    this._weatherList.makeListStrategyFn = (dayData: DayInfo) => {
      const { weather, details } = dayData;
      let weatherHTML = '';
      if( weather) {
        weatherHTML = `
        <div class="row">
          <strong>${moment(weather.valid_date).format('L')}</strong>
          <img class="list__image" src="${getWeatherIcon(weather)}"/>
        </div>
        <p><em>Weather details:</em> ${weather.weather.description} - ${weather.temp} °C</p>
        `
      }
      const detailsHTML = [];
      details?.forEach(detail => {
        let iconClass;
        switch (detail.type) {
          case 'stay':
            iconClass = 'fas fa-hotel'
            break;
          case 'travel':
            iconClass='fas fa-route'
          case 'todo':
          default:
            iconClass= 'fas fa-check-square'
        }
        const detailHTML = `
        <li class="margin-small"><strong>${moment(detail.date).format('HH:mm')}</strong> - <i class="${iconClass}"></i><em>${detail.type.toLowerCase()}</em><span>: ${detail.content}</li>`
        detailsHTML.push(detailHTML);
      });

      return details ? `${weatherHTML}<p><em>Planning</em></p><ul>${detailsHTML.join('')}</ul>` : `${weatherHTML}<p>`;
    }
  }

  protected _attachEventHandlers(): void {
    this._detailCard.addEventListener('remove', () => this._onRemove());
    this.addEventListener('edit', () => navigateTo('#edit'));
  }

  private _onRemove(): void {
    const tripId = this._tripService.currentTrip.id;
    this._dialogService.show('Are you sure?').subscribe(result => {
      if (result) {
        this._tripService.currentTrip = null;
        this._tripService.delete(tripId);
        this._toastService.showSuccess('Trip deleted!');
        setTimeout(() => navigateTo('home'));
      }
    });
  }
}
