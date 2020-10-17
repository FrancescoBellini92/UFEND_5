export default abstract class WebComponent extends HTMLElement {

  static SELECTOR: string;

  protected _html: string;

  constructor() {
    super();
  }

  static define(className: any): void {
    customElements.define(this.SELECTOR, className);
  }

  protected _init(): void {
    this._attachHTML();
    this._queryTemplate();
    this._attachEventHandlers();
  }

  protected _attachHTML(): void {
    this.innerHTML = this._html;
  }

  protected abstract _queryTemplate(): void

  protected abstract _attachEventHandlers(): void

}