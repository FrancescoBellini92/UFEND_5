import WebComponent from "../../base/web.component";
import TripCardComponent from '../trip-card/trip-card.component';
import { hide, show } from "../../DOM-utils/DOM-utils";
import Trip from "../../models/trip.model";
import { Component } from "../../base/decorators";
import { Inject } from "../../base/inject";
import TripService from "../../services/trip.service";
import { CardRemoveEvent, CardViewEvent } from "../../models/events";
import { navigateTo } from "../../base/router";

const template: string = require("./home-page.component.html");

@Inject({
  injectionToken: TripService.injectionToken,
  nameAsDependency: '_tripService'
})
@Component({
  selector:"home-page",
  template
})
export default class HomePageComponent extends WebComponent {

  private _emptyContainer: HTMLElement;
  private _homeTitle: HTMLElement;
  private _cardContainer: HTMLElement;
  private _tripService: TripService;

  private _cardTripMap = new Map();

  constructor() {
    super();
    this._init();
    this._tripService.onTripAdded$.subscribe((trip: Trip) => {
      this.updateProps(trip)
      this._updateUI();
    });
  }

  static define(): void {
    super.define(HomePageComponent);
  }

  connectedCallback(): void {
    this.updateProps(...this._tripService.trips);
  }

  show(): void {
    this._updateUI();
    show(this.firstElementChild);
  }


  hide(): void {
    hide(this.firstElementChild);
  }

  updateProps(...trips: Trip[]): void {
    const fragment = document.createDocumentFragment();
    trips.forEach(trip => {
      const tripCard = new TripCardComponent();
      this._cardTripMap.set(trip.general.id, tripCard);
      tripCard.updateProps(trip)
      fragment.appendChild(tripCard);
    });
    this._cardContainer.insertBefore(fragment, this._cardContainer.firstChild);
  }


  protected _queryTemplate(): void {
    this._emptyContainer = this.querySelector('#empty-container');
    this._homeTitle = this.querySelector('#home-title');
    this._cardContainer = this.querySelector('#card-container');
  }

  protected _attachEventHandlers(): void {
    this.addEventListener('remove', this._onRemove);
    this.addEventListener('view', this._onView);
  }

  private _onRemove(e: CardRemoveEvent): void {
    const tripId = e.detail;
    this._tripService.delete(tripId);
    const element = this._cardTripMap.get(tripId);
    element.remove();
    this._cardTripMap.delete(tripId);
    this._updateUI();
  }

  private _onView(e: CardViewEvent): void {
    const currentTrip = e.detail;
    this._tripService.currentTrip = currentTrip;
    navigateTo('#detail');
  }

  private _updateUI(dataSize: number = this._cardTripMap.size): void {
    const hasProps = dataSize > 0;
    if (hasProps) {
      hide(this._emptyContainer);
      show(this._homeTitle);
    }
  }

}
