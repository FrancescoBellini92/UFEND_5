export default class WebComponent extends HTMLElement {

  static selector: string;

  public html: string;
  public hasShadow: boolean;
  public _style: { default: string };
  protected _shadowRoot: ShadowRoot;

  constructor() {
    super();
  }

  static define(className: any): void {
    customElements.define(this.selector, className);
  }

  protected _init(): void {
    this._attachHTML();
    if (this._style) {
      this._attachStyle();
    }
  }

  protected _attachHTML(): void {
    this._shadowRoot = this.hasShadow ? this.attachShadow({ mode: "open" }): null;
    const root = this._shadowRoot ?? this;
    root.innerHTML = this.html;
  }

  protected _attachStyle(): void {
    const style = document.createElement('style');
    style.textContent = this._style.default;
    this._shadowRoot.appendChild(style);
  }
}
