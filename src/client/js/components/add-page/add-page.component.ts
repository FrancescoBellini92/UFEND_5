import { hide, show } from "../../DOM-utils/DOM-utils";
import { Component } from "../../base/decorators";
import { Inject } from "../../base/inject";
import TripService, { BadRequestError } from "../../services/trip.service";
import TripFormComponent from "../trip-form/trip-form.component";
import { AddFormSubmitEvent } from "../../models/events";
import DynamicWebComponent from "../../base/dynamic.web.component";

const template: string = require("./add-page.component.html");

@Inject({
  injectionToken: TripService.injectionToken,
  nameAsDependency: '_tripService'
})
@Component({
  selector:"add-page",
  template
})
export default class AddPageComponent extends DynamicWebComponent {

  private _tripForm: TripFormComponent;
  private _loader: HTMLElement;
  private _addSuccessAlert: HTMLElement;
  private _addErrorAlert: HTMLElement;

  private _tripService: TripService;

  constructor() {
    super();
    this._init();
  }

  static define(): void {
    super.define(this);
  }

  show(): void {
    hide(this._addSuccessAlert);
    hide(this._addErrorAlert);
    show(this.firstElementChild);
  }

  hide(): void {
    hide(this.firstElementChild);
  }

  protected _queryTemplate(): void {
    this._tripForm = document.getElementById('trip-form') as TripFormComponent;
    this._loader = document.getElementById('loader');
    this._addSuccessAlert = document.getElementById('add-success');
    this._addErrorAlert = document.getElementById('add-error');
  }

  protected _attachEventHandlers(): void {
    this.addEventListener('submit', this._onSubmit);
  }

  private async _onSubmit(e: AddFormSubmitEvent): Promise<void> {
    try {
      hide(this._addErrorAlert, this._addSuccessAlert);
      show(this._loader);
      await this._tripService.add(e.detail);
      this._tripForm.reset();
      show(this._addSuccessAlert);
    } catch (e) {
      debugger;
      if (e instanceof BadRequestError) {
        show(this._addErrorAlert);
      } else {
        throw e;
      }
    } finally {
      hide(this._loader);
    }
  }

}
