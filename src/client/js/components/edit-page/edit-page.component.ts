import DynamicWebComponent from '../../base/dynamic.web.component';
import TripCardComponent from '../trip-card/trip-card.component';
import { hide, show } from "../../DOM-utils/DOM-utils";
import Trip from "../../models/trip.model";
import { Component } from "../../base/decorators";
import { Inject } from "../../base/inject";
import TripService, { BadRequestError } from "../../services/trip.service";
import { RemoveTripEvent, SaveTripDetailsEvent, SubmitTripEvent } from "../../models/events";
import TripListComponent from "../trip-list/trip-list.component";
import moment from "moment";
import TripDetailComponent from '../trip-detail/trip-detail.component';
import { navigateTo, Routable } from '../../base/router';
import TripFormComponent from '../trip-form/trip-form.component';

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

  private _tripDetail: TripDetailComponent;
  private _tripForm: TripFormComponent;
  private _loader: HTMLElement;

  private _tripService: TripService;

  constructor() {
    super();
    this._tripService.currentTrip$.subscribe((trip: Trip) => this.updateProps(trip));
  }

  show(): void {
    show(this.firstElementChild);
    show(this._tripForm);
    hide(this._tripDetail);
  }

  hide(): void {
    hide(this.firstElementChild);
  }

  updateProps(trip: Trip): void {
    this._tripForm.updateProps(trip.general);
    trip.details ? this._tripDetail.updateProps(trip.details) : this._tripDetail.reset();
  }

  protected _queryTemplate(): void {
    this._tripDetail = this.querySelector('trip-detail') as TripDetailComponent;
    this._tripForm = this.querySelector('trip-form') as TripFormComponent;
    this._loader = this.querySelector('.loader');
  }

  protected _attachEventHandlers(): void {
    this.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      const isFromPagenav = target.parentElement.classList.contains('pagenav');
      if (isFromPagenav) {
        this._navigatePage(target);
      }
    });

    this.addEventListener('submit', (e: SubmitTripEvent) => this._onSubmit(e));
    this.addEventListener('save-details', (e: SaveTripDetailsEvent) => this._tripService.editDetails(e.detail));

  }

  private async _onSubmit(e: SubmitTripEvent): Promise<void> {
    try {
      show(this._loader);
      await this._tripService.edit(e.detail);
      this._tripForm.updateProps(this._tripService.currentTrip.general);
      // TODO: SHOW SUCCESS TOAST
    } catch (e) {
      if (e instanceof BadRequestError) {
      // TODO: SHOW ERROR TOAST
    } else {
        throw e;
      }
    } finally {
      hide(this._loader);
    }
  }

  private _navigatePage(target: HTMLElement) {
    const tripFormUIFn = target.textContent === 'Main' ? show : hide;
    const tripDetailUIFn = target.textContent === 'Details' ? show : hide;
    tripFormUIFn(this._tripForm);
    tripDetailUIFn(this._tripDetail);
  }
}
