import router from './router';
import { parser } from './template-binder';

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
  }

  connectedCallback() {
    this.render();
  }

  static define(): void {
    customElements.define(this.selector, this);
  }

  queryShadowRoot(selector: string, multiple?: boolean): HTMLElement {
    return this._shadowRoot[multiple ? 'queryselectorAll' : 'querySelector'](selector);
  }

  public async render(): Promise<void> {
    await this._attachHTML();
    if (this._style) {
      this._attachStyle();
    }
  }

  protected async _attachHTML(): Promise<void>{
    this._shadowRoot = this.hasShadowDom ? this.attachShadow({ mode: "open" }): null;
    const root = this._shadowRoot ?? this;
    const bindedDomTree = await parser.parse(this);
    root.appendChild(bindedDomTree.content);
  }

  protected _attachStyle(): void {
    const style = document.createElement('style');
    style.textContent = this._style.default;
    this._shadowRoot.appendChild(style);
  }
}
