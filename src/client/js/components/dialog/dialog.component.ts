import { Component } from "../../base/decorators";
import DynamicWebComponent from "../../base/dynamic.web.component";
import { Inject } from "../../base/inject";
import WebComponent from "../../base/web.component";
import { hide, show } from "../../DOM-utils/DOM-utils";
import { DialogEvent } from "../../models/events";
import DialogService from "../../services/dialog.service";

const template = require('./dialog.component.html');
const style = require('./dialog.component.scss');

@Inject({
  injectionToken: DialogService.injectionToken,
  nameAsDependency: '_dialogService'
})
@Component({
  selector: 'dialog-component',
  template,
  hasShadowDom: true,
  style
})
export default class DialogComponent extends DynamicWebComponent {

  private _dialogService: DialogService;

  private _abortBtn: HTMLButtonElement;
  private _okBtn: HTMLButtonElement;
  private _paragraphEl: HTMLElement;

  constructor() {
    super();
    this._dialogService.dialogEl = this;
  }

  show(message: string): void {
    this._paragraphEl.textContent = message;
    show(this.shadowRoot.firstElementChild)
  }

  hide(): void {
    hide(this.shadowRoot.firstElementChild)
  }

  protected _queryTemplate(): void {
    this._abortBtn = this.shadowRoot.querySelector('#abort');
    this._okBtn = this.shadowRoot.querySelector('#ok');
    this._paragraphEl = this.shadowRoot.querySelector('#dialog__text');
  }

  protected _attachEventHandlers(): void {
    this._abortBtn.addEventListener('click', () => this._emitEvent(false));
    this._okBtn.addEventListener('click', () => this._emitEvent(true));
  }

  private _emitEvent(detail: boolean): void {
    const event = new DialogEvent('dialogEvent', { detail, bubbles: true });
    this.dispatchEvent(event);
    this.hide();
  }
}