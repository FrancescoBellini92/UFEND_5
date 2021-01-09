import { hide, show } from "../../DOM-utils/DOM-utils";
import { Component } from "../../base/component";
import { Inject } from "../../base/inject";
import TripFormComponent from "../trip-form/trip-form.component";
import { SubmitTripEvent } from "../../models/events";
import DynamicWebComponent from "../../base/dynamic.web.component";
import { navigateTo, Routable } from "../../base/router";
import ToastService from "../../services/toast.service";
import { BadRequestError } from "../../exceptions/exceptions";
import TripService from "../../services/trip.service";
import { Child } from "../../base/child";

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

  @Child('trip-form')
  private _tripForm: TripFormComponent;

  @Child('.loader')
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

  protected _attachEventHandlers(): void {
    this.addEventListener('submit', (e: SubmitTripEvent) => this._onSubmit(e));
  }

  private async _onSubmit(e: SubmitTripEvent): Promise<void> {
    try {
      requestAnimationFrame(() => show(this._loader));
      await this._tripService.add(e.detail);
      this._tripForm.reset();
      this._toastService.showSuccess('Trip created!')
      setTimeout(() => navigateTo('#details'), 1000);
    } catch (e) {
      if (e instanceof BadRequestError) {
        this._toastService.showDanger(e.message)
    } else {
        throw e;
      }
    } finally {
      requestAnimationFrame(() => hide(this._loader));
    }
  }

}
