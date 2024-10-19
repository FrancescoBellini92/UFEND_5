import Observable from './observable';
import router from './router';
import { MasterBinder } from './binders/MasterBinder';

/**
 * Base class for all components
 */
export default class WebComponent extends HTMLElement {

  static selector: string;

  public route: string;

  public html: string;
  public hasShadowDom: boolean;
  public _style: { default: string };
  public boundPropertiesChange$ =  new Observable<Record<string, any>>(async (boundProps: Record<string, any>) => boundProps)

  protected _shadowRoot: ShadowRoot;

  public _parser: MasterBinder;

  constructor() {
    super();
    if (this.route != undefined) {
      router.register(this);
    }

    this._parser = new MasterBinder(this)
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

  public notifyBoundProperties(val: Record<string, any>): void {
    this.boundPropertiesChange$.next(val)
  }

  protected async _attachHTML(): Promise<void>{
    this._shadowRoot = this.hasShadowDom ? this.attachShadow({ mode: "open" }): null;
    const root = this._shadowRoot ?? this;
    const bindedDomTree = await this._parser.parseAndDigest();
    root.appendChild(bindedDomTree.content);
  }

  protected _attachStyle(): void {
    const style = document.createElement('style');
    style.textContent = this._style.default;
    this._shadowRoot.appendChild(style);
  }
}
