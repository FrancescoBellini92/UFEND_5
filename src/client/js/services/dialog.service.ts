import Observable from '../base/observable';
import { Service } from '../base/service';
import { Injectable } from "../base/service";
import DialogComponent from '../components/dialog/dialog.component';
import { DialogEvent } from '../models/events';

@Injectable({
  injectionToken: 'dialogService',
  isSingleton: true
})
export default class DialogService extends Service {

  private _dialogEl: DialogComponent;

  private _dialogEvent$: Observable<boolean, boolean> = new Observable<boolean, boolean>(async(dialogEvent) => dialogEvent);

  constructor() {
    super();
  }

  static factoryFn(): DialogService {
    return new DialogService();
  }

  set dialogEl(el: DialogComponent) {
    this._dialogEl = el;
    this._dialogEl.addEventListener('dialogEvent', (e: DialogEvent) => this._dialogEvent$.next(e.detail) )
  }

  show(message: string): Observable<boolean, boolean> {
    this._dialogEl.show(message);
    return this._dialogEvent$;
  }
}
