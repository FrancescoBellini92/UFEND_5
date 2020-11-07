import DynamicWebComponent from '../../base/dynamic.web.component';
import TripCardComponent from '../trip-card/trip-card.component';
import { hide, show } from "../../DOM-utils/DOM-utils";
import Trip from "../../models/trip.model";
import { Component } from "../../base/decorators";
import { Inject } from "../../base/inject";
import TripService from "../../services/trip.service";
import { RemoveTripEvent } from "../../models/events";
import TripListComponent from "../trip-list/trip-list.component";
import moment from "moment";
import TripDetailComponent from '../trip-detail/trip-detail.component';
import { navigateTo, Routable } from '../../base/router';

const template: string = require("./edit-page.component.html");

@Inject({
  injectionToken: TripService.injectionToken,
  nameAsDependency: '_tripService'
})
@Component({
  selector:"edit-page",
  template,
  route: '#edit'
})
export default class EditPageComponent extends DynamicWebComponent implements Routable {

  private _detailTitle: HTMLElement;
  private _tripDetail: TripDetailComponent;
  private _saveButton: HTMLElement;

  private _tripService: TripService;

  constructor() {
    super();
    this._tripService.currentTrip$.subscribe((trip: Trip) => this.updateProps(trip));
  }

  show(): void {
    show(this.firstElementChild);
  }

  hide(): void {
    hide(this.firstElementChild);
  }

  updateProps(trip: Trip): void {
    if (trip.details) {
      this._tripDetail.updateProps(trip.details);
    }
    this._tripDetail.reset();
  }

  protected _queryTemplate(): void {
    this._detailTitle = document.getElementById('detail-title');
    this._tripDetail = document.getElementById('trip-details') as TripDetailComponent;
    this._saveButton = document.getElementById('save-details');
  }

  protected _attachEventHandlers(): void {
    this._saveButton.addEventListener('click', () => this._onSubmit());
  }

  private _onSubmit(): void {
    const details = this._tripDetail.tripDetails;
    this._tripService.edit()
    // TODO: SHOW TOAST;
    setTimeout(() => navigateTo('#detail'), 500);
  }
}
