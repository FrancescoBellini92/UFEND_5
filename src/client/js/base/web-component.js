export class WebComponent extends HTMLElement {

  static SELECTOR;
  
  _html;

  constructor() {
    super();
  }

  static define(className) {
    customElements.define(this.SELECTOR, className);
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
  
}