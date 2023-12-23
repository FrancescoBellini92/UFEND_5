import Observable from '../base/observable';
import { Injectable } from "../base/injectable";
import DialogComponent from '../components/dialog/dialog.component';
import { DialogEvent } from '../models/events';

@Injectable({
  isSingleton: true
})
export default class DialogService {

  private _dialogEl: DialogComponent;

  private _dialogEvent$: Observable<boolean, boolean> = new Observable<boolean, boolean>(async(dialogEvent) => dialogEvent);

  set dialogEl(el: DialogComponent) {
    this._dialogEl = el;
    this._dialogEl.addEventListener('dialogEvent', (e: DialogEvent) => this._dialogEvent$.next(e.detail) )
  }

  show(message: string): Observable<boolean, boolean> {
    this._dialogEl.show(message);
    return this._dialogEvent$;
  }
}
