import { Injectable } from "../base/injectable";
import ToastComponent from '../components/toast/toast.component';

@Injectable({
  isSingleton: true
})
export default class ToastService {

  private _toastEl: ToastComponent;

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
