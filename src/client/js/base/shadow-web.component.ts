import WebComponent from "./web.component";

export default abstract class ShadowWebComponent extends WebComponent {

  protected _shadowRoot: ShadowRoot;
  protected _styles: { default: string };

  constructor() {
    super();
  }

  protected _init(): void {
    this._attachShadowRoot();
    super._init();
    this._attachStyle();
  }
  protected _attachShadowRoot(): void {
    this._shadowRoot = this.attachShadow({ mode: "open" });
  }

  protected _attachHTML(): void {
    this._shadowRoot.innerHTML = this._html;
  }

  protected _attachStyle(): void {
    const style = document.createElement('style');
    style.textContent = this._styles.default;
    this._shadowRoot.appendChild(style);
  }

  protected abstract _queryTemplate(): void

  protected abstract _attachEventHandlers(): void

}