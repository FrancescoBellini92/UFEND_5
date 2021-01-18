import WebComponent from "./web.component";

export const Child: ChildDecorator = (selector, multiple?) => (target, name) => {
  let element: HTMLElement | NodeListOf<Element>;

  const getElementFn = function() {
    const privateElementProperty = `__${name}`
    if (!this[privateElementProperty]) {
      this[privateElementProperty] = this.hasShadowDom ? this.queryShadowRoot(selector, multiple) : this[multiple ? 'queryselectorAll' : 'querySelector'](selector);
    }
    return this[privateElementProperty];
  }

  const setElementFn = (el: HTMLElement) => element = el

  Object.defineProperty(target, name, { get: getElementFn, set: setElementFn } )
}

export type ChildDecorator = {(selector: string, multiple?: boolean): { <T extends WebComponent>(target: T, name: string): void }}