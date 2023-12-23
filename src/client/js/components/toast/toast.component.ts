import { Component } from "../../base/component";
import { Inject } from "../../base/inject";
import WebComponent from "../../base/web.component";
import { addClass, hide, removeClass, show } from "../../DOM-utils/DOM-utils";
import ToastService from "../../services/toast.service";

const template = require('./toast.component.html');

@Inject({
  injectionToken: ToastService,
  nameAsDependency: '_toastService'
})
@Component({
  selector: 'toast-component',
  template
})
export default class ToastComponent extends WebComponent {

  private _toastService: ToastService;

  constructor() {
    super();
    this._toastService.toastEl = this;
  }

  showSucces(message: string): void {
    requestAnimationFrame(() => {
      this.firstElementChild.classList.remove('bg-danger');
      this.firstElementChild.classList.add('bg-success');
      this.firstElementChild.firstElementChild.textContent = message;

      this._showAndHide();
    });
  }

  showDanger(message: string): void {

    requestAnimationFrame(() => {
      removeClass('bg-success', this.firstElementChild);
      addClass('bg-danger', this.firstElementChild);
      this.firstElementChild.firstElementChild.textContent = message;

      this._showAndHide();
    });
  }

  private _showAndHide(): void {
    setTimeout(() => requestAnimationFrame(() => show(this.firstElementChild)));
    setTimeout(() => requestAnimationFrame(() => hide(this.firstElementChild)), 2000);
  }
}