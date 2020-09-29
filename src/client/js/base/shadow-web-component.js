import { WebComponent } from "./web-component";


export class ShadowWebComponent extends WebComponent {
  _html;
  _shadowRoot;
  _styles;

  constructor() {
    super();
  }

  _init() {
    this._attachShadowRoot();
    this._attachHTML();
    this._attachStyle();
  }

  _attachShadowRoot() {
    this._shadowRoot = this.attachShadow({ mode: "open" });
  }

  _attachStyle() {
    const style = document.createElement('style');
    style.textContent = this._styles;
    this.appendChild(style);
  }
  _attachHTML() {
    this.innerHTML = this._html;
  }

  static define(selector, className) {
    customElements.define(selector, className);
  }
}
