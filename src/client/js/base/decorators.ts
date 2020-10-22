import WebComponent from "./web.component";

export const Component: {(componentParams: ComponentParameters): { (target: typeof WebComponent): void }} =
  ({ selector, template, hasShadow, style }) => target => { // target is ctor function
      target.selector = selector; // add to ctor function
      target.prototype.html = template; // add to ctor function prototype
      target.prototype.hasShadow = hasShadow;
      target.prototype._style = style;
      debugger;
};

interface ComponentParameters {
  selector: string;
  template: string,
  hasShadow?: boolean,
  style?: { default: string };
}

