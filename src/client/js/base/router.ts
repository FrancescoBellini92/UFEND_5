export const HOME_HASH = '#home';
export const BACK_HASH = '#back';

export function navigateTo(hash: string = HOME_HASH) {
  window.location.hash = hash;
}

export interface Routable extends Object {
  show: { (): void; };
  hide: { (): void; };
}

export class Router {
  routes: Map<string, Routable>;

  constructor() {
    this.routes = new Map<string, Routable>();
    this.routes.set(BACK_HASH, {show: this._back, hide: () => {}})
    window.addEventListener('hashchange', () => this._onNavigation());
  }

  register(component: any): void {
    this.routes.set(component.route, component);
  }

  private _back(): void {
    window.history.back();
    window.history.back();
  }

  private _onNavigation(): void {
    const hash = this.routes.has(window.location.hash) ? window.location.hash : '';
    this.routes.forEach((component, route) => {
      try {
        route === hash ? component.show() : component.hide()
      } catch (e) {
        if (e instanceof TypeError) {
          throw new UnRoutableComponentError(component.constructor.name);
        } else {
          throw e;
        }
      }
    })
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

export class UnRoutableComponentError extends Error {
  name: string = 'UnRoutableComponentError';

  constructor(componentName: string) {
    super(`${componentName} does not implement Routable interface`);
  }
}

export default new Router();
