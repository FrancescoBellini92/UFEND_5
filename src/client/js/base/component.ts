import WebComponent from "./web.component";

/**
 * Decorates a class with component related properties
 */
export const Component: ComponentDecorator =  ({ selector, template, hasShadowDom, style, route }) => target => {
      target.selector = selector;
      target.prototype.html = template;
      target.prototype.hasShadowDom = hasShadowDom;
      target.prototype._style = style;
      target.prototype.route = route;
};

export type ComponentDecorator = {(componentParams: ComponentParameters): { <T extends typeof WebComponent>(target:  T): void }};

interface ComponentParameters {
  selector: string;
  template: string,
  hasShadowDom?: boolean,
  style?: { default: string };
  route?: string;
}

