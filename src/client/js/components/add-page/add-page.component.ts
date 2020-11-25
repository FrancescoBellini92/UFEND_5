import { hide, show } from "../../DOM-utils/DOM-utils";
import { Component } from "../../base/decorators";
import { Inject } from "../../base/inject";
import TripFormComponent from "../trip-form/trip-form.component";
import { SubmitTripEvent } from "../../models/events";
import DynamicWebComponent from "../../base/dynamic.web.component";
import { navigateTo, Routable } from "../../base/router";
import ToastService from "../../services/toast.service";
import { BadRequestError } from "../../exceptions/exceptions";
import TripService from "../../services/trip.service";

const template: string = require("./add-page.component.html");

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
  selector:"add-page-main",
  template,
  route: '#add'
})
export default class AddPageComponent extends DynamicWebComponent implements Routable {

  private _tripForm: TripFormComponent;
  private _loader: HTMLElement;
  private _tripService: TripService;
  private _toastService: ToastService;

  constructor() {
    super();
  }

  show(): void {
    show(this.firstElementChild);
  }

  hide(): void {
    hide(this.firstElementChild);
  }

  protected _queryTemplate(): void {
    this._tripForm = this.querySelector('trip-form') as TripFormComponent;
    this._loader = this.querySelector('.loader');
  }

  protected _attachEventHandlers(): void {
    this.addEventListener('submit', (e: SubmitTripEvent) => this._onSubmit(e));
  }

  private async _onSubmit(e: SubmitTripEvent): Promise<void> {
    try {
      show(this._loader);

      await this._tripService.add(e.detail);

      this._tripForm.reset();
      this._toastService.showSuccess('Trip created!')
      setTimeout(() => navigateTo('#details'), 1000);
    } catch (e) {
      if (e instanceof BadRequestError) {
        this._toastService.showDanger('Something went wrong: are the trip info correct?')
    } else {
        throw e;
      }
    } finally {
      hide(this._loader);
    }
  }

}
