import { Service } from '../base/service';
import { Injectable } from "../base/service";
import ToastComponent from '../components/toast/toast.component';

@Injectable({
  injectionToken: 'toastService',
  isSingleton: true
})
export default class ToastService extends Service {

  private _toastEl: ToastComponent;

  constructor() {
    super();
  }

  static factoryFn(): ToastService {
    return new ToastService();
  }

  set toastEl(el: ToastComponent) {
    this._toastEl = el;
  }

  showSuccess(message: string): void {
    this._toastEl.showSucces(message);
  }

  showDanger(message: string): void {
    this._toastEl.showDanger(message);
  }
}
