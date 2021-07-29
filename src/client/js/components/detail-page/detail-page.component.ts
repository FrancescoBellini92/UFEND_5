import DynamicWebComponent from '../../base/dynamic.web.component';
import TripCardComponent from '../trip-card/trip-card.component';
import { hide, show } from "../../DOM-utils/DOM-utils";
import Trip from "../../models/trip.model";
import { Component } from "../../base/component";
import { Inject } from "../../base/inject";
import TripService from "../../services/trip.service";
import TripListComponent from "../trip-list/trip-list.component";
import { navigateTo, Routable } from '../../base/router';
import ToastService from '../../services/toast.service';
import DialogService from '../../services/dialog.service';
import { Child } from '../../base/child';

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
export default class DetailPageComponent extends DynamicWebComponent implements Routable {

  @Child('#detail-card')
  private _detailCard: TripCardComponent;

  @Child('#detail-list')
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
    this._detailCard.hideChildren('#view');
    this._detailCard.updateProps(trip);
    this._weatherList.addMany(TripService.getDayInfo(trip));
  }

  protected _attachEventHandlers(): void {
    this._detailCard.addEventListener('remove', () => this._onRemove());
    this.addEventListener('edit', () => navigateTo('#edit'));
  }

  private _onRemove(): void {
    const tripId = this._tripService.currentTrip.id;
    const dialogObs$ = this._dialogService.show('Are you sure?').subscribe(result => {
      if (result) {
        this._tripService.currentTrip = null;
        this._tripService.delete(tripId);
        this._toastService.showSuccess('Trip deleted!');
        setTimeout(() => navigateTo('home'));
      }
      dialogObs$.unsubscribe();
    });
  }
}
