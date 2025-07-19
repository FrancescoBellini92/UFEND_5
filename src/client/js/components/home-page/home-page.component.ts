import DynamicWebComponent from "../../base/dynamic.web.component";
import TripCardComponent from '../trip-card/trip-card.component';
import { hide, show } from "../../DOM-utils/DOM-utils";
import Trip from "../../models/trip.model";
import { Component } from "../../base/component";
import { Inject } from "../../base/inject";
import TripService from "../../services/trip.service";
import { RemoveTripEvent, SelectTripEvent } from "../../models/events";
import { navigateTo, Routable } from "../../base/router";
import ToastService from "../../services/toast.service";
import DialogService from "../../services/dialog.service";
import { Child } from "../../base/child";
import { Effect } from "../../base/effect";

const template: string = require("./home-page.component.html");

@Inject(
  {
    injectionToken: TripService,
    nameAsDependency: '_tripService'
  },
  {
    injectionToken: ToastService,
    nameAsDependency: '_toastService'
  },
  {
    injectionToken: DialogService,
    nameAsDependency: '_dialogService'
  }
)
@Component({
  selector:"home-page",
  template,
  route: ''
})
export default class HomePageComponent extends DynamicWebComponent implements Routable {

  @Effect({onChange() {
    this.hasNoTrips = this.trips?.length == 0;
  }})
  public trips: Trip[];

  @Effect()
  public hasNoTrips = true;

  private _tripService: TripService;
  private _toastService: ToastService;
  private _dialogService: DialogService;

  private _cardTripMap = new Map();

  constructor() {
    super();

    this._tripService.onTripAdded$.subscribe(trip => {
      this.updateProps(trip)
      requestAnimationFrame(() => this._updateUI());
    });

    this._tripService.onTripEdited$.subscribe(editedTrip => {
      this.trips = this.trips.map(trip => trip.id === editedTrip.id ? editedTrip : trip )

    });

    this._tripService.onTripDeleted$.subscribe(tripId => {
      const element = this._cardTripMap.get(tripId) as TripCardComponent;
      requestAnimationFrame(() => {
        element.remove();
        this._cardTripMap.delete(tripId);
        this._updateUI();
      });
    });
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.updateProps(...this._tripService.trips);
  }

  show(): void {
    requestAnimationFrame(() => {
      this._updateUI();
      show(this.firstElementChild);
    });
  }

  hide(): void {
    requestAnimationFrame(() => hide(this.firstElementChild));
  }

  updateProps(...trips: Trip[]): void {
    this.trips = trips;
  }

  protected _attachEventHandlers(): void {
    this.addEventListener('remove', this._onRemove);
    this.addEventListener('view', (e: SelectTripEvent) => this._selectAndNavigate(e, '#details'));
    this.addEventListener('edit', (e: SelectTripEvent) => this._selectAndNavigate(e, '#edit'));
  }

  private _onRemove(e: RemoveTripEvent): void {
    const tripId = e.detail;
    const dialogObs$ = this._dialogService.show('Are you sure?').subscribe(result => {
      if (result) {
        this._tripService.delete(tripId);
        this._toastService.showSuccess('Trip deleted!');
      }
      dialogObs$.unsubscribe();
    });

  }

  private _selectAndNavigate(e: SelectTripEvent, route: string): void {
    const tripId = e.detail;
    this._tripService.setCurrentTripById(tripId);
    navigateTo(route);
  }

  private _updateUI(dataSize: number = this._cardTripMap.size): void {
    const isEmpty = dataSize === 0;
    const emptyContainerUIFn =  isEmpty ? show : hide;
    // emptyContainerUIFn(this._emptyContainer);
  }

}
