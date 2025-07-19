import WebComponent from "./web.component";

/**
 * Component class extended with event handling logic
 */
export default abstract class DynamicWebComponent extends WebComponent {

  public render(): void{
    super.render();
    this._attachEventHandlers();
  }

  protected abstract _attachEventHandlers(): void
}