import WebComponent from "./web.component";

/**
 * Component class extended with event handling logic
 */
export default abstract class DynamicWebComponent extends WebComponent {

  protected _init(): void {
    super._init();
    this._attachEventHandlers();
  }

  protected abstract _attachEventHandlers(): void
}