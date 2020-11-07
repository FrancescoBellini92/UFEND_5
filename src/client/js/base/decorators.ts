import WebComponent from "./web.component";

export const Component: {(componentParams: ComponentParameters): { <T extends typeof WebComponent>(target:  T): void }} =
  ({ selector, template, hasShadow, style, route }) => target => {
      target.selector = selector;
      target.prototype.html = template;
      target.prototype.hasShadow = hasShadow;
      target.prototype._style = style;
      target.prototype.route = route;
};

interface ComponentParameters {
  selector: string;
  template: string,
  hasShadow?: boolean,
  style?: { default: string };
  route?: string;
}

