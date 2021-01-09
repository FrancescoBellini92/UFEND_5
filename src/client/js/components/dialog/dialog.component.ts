import { Child } from "../../base/child";
import { Component } from "../../base/component";
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

  @Child('#abort')
  private _abortBtn: HTMLButtonElement;

  @Child('#ok')
  private _okBtn: HTMLButtonElement;

  @Child('#dialog__text')
  private _paragraphEl: HTMLElement;

  private _dialogService: DialogService;

  constructor() {
    super();
    this._dialogService.dialogEl = this;
  }

  show(message: string): void {
    this._paragraphEl.textContent = message;
    requestAnimationFrame(()=> show(this.shadowRoot.firstElementChild));
  }

  hide(): void {
    requestAnimationFrame(() => hide(this.shadowRoot.firstElementChild));
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