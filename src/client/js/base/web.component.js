export default class WebComponent extends HTMLElement {

  static SELECTOR;
  
  _html;
  _shadowRoot;
  _styles;

  constructor() {
    super();
  }

  static define(className) {
    customElements.define(this.SELECTOR, className);
  }

  _init() {
    this._attachShadowRoot();
    this._attachHTML();
    this._attachStyle();
    this._queryTemplate();
    this._attachEventHandlers();
  }
  _attachShadowRoot() {
    this._shadowRoot = this.attachShadow({ mode: "open" });
  }

  _attachHTML() {
    this._shadowRoot.innerHTML = this._html;
  }

  _attachStyle() {
    if (this._styles) {
      const style = document.createElement('style');
      style.textContent = this._styles;
      this._shadowRoot.appendChild(style);
    }
  }

  _queryTemplate() {}

  _attachEventHandlers() {}

}