export const Component: {(params: ComponentParameters): { (target: any): void }} =
  params => target => { // target is ctor function
    const { selector, template, hasShadow, style } = params;
    target.selector = selector; // add to ctor function (as class static prop)
    target.prototype._html = template; // add to ctor function prototype (as class instance prop)
    target.prototype._hasShadow = hasShadow;
    target.prototype._style = style;
};

interface ComponentParameters {
  selector: string;
  template: string,
  hasShadow?: boolean,
  style?: { default: string }
}