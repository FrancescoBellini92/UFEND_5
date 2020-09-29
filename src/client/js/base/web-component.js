export class WebComponent extends HTMLElement {
  _html;

  constructor() {
    super();
  }

  _init() {
    this._attachHTML();
  }

  _attachShadowRoot() {
    this._shadowRoot = this.attachShadow({ mode: "open" });
  }

  _attachHTML() {
    this.innerHTML = this._html;
  }

  static define(selector, className) {
    customElements.define(selector, className);
  }
}