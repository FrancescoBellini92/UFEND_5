import { WebComponent } from "./web-component";


export class ShadowWebComponent extends WebComponent {

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
}
