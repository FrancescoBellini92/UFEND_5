import { hide, show } from "../../DOM-utils/DOM-utils";
import { Component } from "../../base/decorators";
import { Inject } from "../../base/inject";
import TripService, { BadRequestError } from "../../services/trip.service";
import TripFormComponent from "../trip-form/trip-form.component";
import { SubmitTripEvent } from "../../models/events";
import DynamicWebComponent from "../../base/dynamic.web.component";
import TripDetailComponent from "../trip-detail/trip-detail.component";
import { navigateTo, Routable } from "../../base/router";

const template: string = require("./add-page.component.html");

@Inject({
  injectionToken: TripService.injectionToken,
  nameAsDependency: '_tripService'
})
@Component({
  selector:"add-page-main",
  template,
  route: '#add'
})
export default class AddPageComponent extends DynamicWebComponent implements Routable {

  private _tripForm: TripFormComponent;
  private _loader: HTMLElement;
  private _tripService: TripService;

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
    this._tripForm = document.getElementById('trip-form') as TripFormComponent;
    this._loader = document.getElementById('loader');
  }

  protected _attachEventHandlers(): void {
    this.addEventListener('submit', this._onSubmit);
  }

  private async _onSubmit(e: SubmitTripEvent): Promise<void> {
    try {
      show(this._loader);

      await this._tripService.add(e.detail);

      this._tripForm.reset();
      // TODO: SHOW SUCCESS TOAST
      setTimeout(() => navigateTo('#details'), 1000);
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

}
