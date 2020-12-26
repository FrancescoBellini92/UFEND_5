import router from './router';

/**
 * Base class for all components
 */
export default class WebComponent extends HTMLElement {

  static selector: string;

  public route: string;

  public html: string;
  public hasShadowDom: boolean;
  public _style: { default: string };
  protected _shadowRoot: ShadowRoot;

  constructor() {
    super();
    if (this.route != undefined) {
      router.register(this);
    }
    this._init();
  }

  static define(): void {
    customElements.define(this.selector, this);
  }

  protected _init(): void {
    this._attachHTML();
    if (this._style) {
      this._attachStyle();
    }
  }

  protected _attachHTML(): void {
    this._shadowRoot = this.hasShadowDom ? this.attachShadow({ mode: "open" }): null;
    const root = this._shadowRoot ?? this;
    root.innerHTML = this.html;
  }

  protected _attachStyle(): void {
    const style = document.createElement('style');
    style.textContent = this._style.default;
    this._shadowRoot.appendChild(style);
  }
}
