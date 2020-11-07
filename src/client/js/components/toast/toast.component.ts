import { Component } from "../../base/decorators";
import { Inject } from "../../base/inject";
import WebComponent from "../../base/web.component";
import { addClass, hide, removeClass, show } from "../../DOM-utils/DOM-utils";
import Trip from "../../models/trip.model";
import TripService from "../../services/trip.service";

const template = require('./toast.component.html');

@Inject({
  injectionToken: TripService.injectionToken,
  nameAsDependency: '_tripService'
})
@Component({
  selector: 'toast-component',
  template
})
export default class ToastComponent extends WebComponent {

  private _tripService: TripService;

  constructor() {
    super();
    this._tripService.onTripAdded$.subscribe(() => this._onTripAdded());
    this._tripService.onTripDeleted$.subscribe(() => this._onTripDeleted());
  }

  private _onTripAdded(): void {
    this.firstElementChild.classList.remove('bg-danger');
    this.firstElementChild.classList.add('bg-success');
    this.firstElementChild.firstElementChild.textContent = 'Trip added!'

    this._showAndHide();
  }

  private _onTripDeleted(): void {
    removeClass('bg-success', this.firstElementChild);
    addClass('bg-danger', this.firstElementChild);
    this.firstElementChild.firstElementChild.textContent = 'Trip deleted!';

    this._showAndHide();
  }

  private _showAndHide() {
    setTimeout(() => show(this.firstElementChild));
    setTimeout(() => hide(this.firstElementChild), 2000);
  }
}