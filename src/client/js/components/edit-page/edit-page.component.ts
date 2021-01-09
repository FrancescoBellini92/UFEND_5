import DynamicWebComponent from '../../base/dynamic.web.component';
import { hide, show } from "../../DOM-utils/DOM-utils";
import Trip from "../../models/trip.model";
import { Component } from "../../base/component";
import { Inject } from "../../base/inject";
import { SaveTripDetailsEvent, SubmitTripEvent } from "../../models/events";
import TripDetailComponent from '../trip-detail/trip-detail.component';
import { Routable } from '../../base/router';
import TripFormComponent from '../trip-form/trip-form.component';
import ToastService from '../../services/toast.service';
import { BadRequestError } from '../../exceptions/exceptions';
import TripService from '../../services/trip.service';
import { Child } from '../../base/child';

const template: string = require("./edit-page.component.html");

@Inject(
  {
    injectionToken: TripService.injectionToken,
    nameAsDependency: '_tripService'
  },
  {
    injectionToken: ToastService.injectionToken,
    nameAsDependency: '_toastService'
  }
)
@Component({
  selector:"edit-page",
  template,
  route: '#edit'
})
export default class EditPageComponent extends DynamicWebComponent implements Routable {

  @Child('trip-detail')
  private _tripDetail: TripDetailComponent;

  @Child('trip-form')
  private _tripForm: TripFormComponent;

  @Child('.loader')
  private _loader: HTMLElement;

  private _tripService: TripService;
  private _toastService: ToastService;

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
    this._tripDetail.updateProps(trip);
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
    this.addEventListener('save-details', (e: SaveTripDetailsEvent) => {
      this._tripService.editDetails(e.detail);
      this._toastService.showSuccess('Changes have been saved')
    });
  }

  private async _onSubmit(e: SubmitTripEvent): Promise<void> {
    try {
      requestAnimationFrame(() => show(this._loader));
      await this._tripService.edit(e.detail);
      this._tripForm.updateProps(this._tripService.currentTrip.general);
      this._toastService.showSuccess('Trip modified!')
    } catch (e) {
      if (e instanceof BadRequestError) {
        this._toastService.showDanger('Something went wrong: are the trip info correct?')
    } else {
        throw e;
      }
    } finally {
      requestAnimationFrame(() => hide(this._loader));
    }
  }

  private _navigatePage(target: HTMLElement): void {
    const tripFormUIFn = target.textContent === 'Main' ? show : hide;
    const tripDetailUIFn = target.textContent === 'Details' ? show : hide;

    requestAnimationFrame(() => {
      tripFormUIFn(this._tripForm);
      tripDetailUIFn(this._tripDetail);
    });
  }
}
