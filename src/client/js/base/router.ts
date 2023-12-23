import factory from "./factory";
import { Injectable } from "./injectable";

export const HOME_HASH = '#home';
export const BACK_HASH = '#back';


/**
 * Manages routing via hash change
 */
@Injectable({
  isSingleton: true
})
export class Router  {

  routes: Map<string, Routable>;

  onNavigationCallbacks: NavigationCallback[] = [];

  constructor() {
    this.routes = new Map<string, Routable>();
    this.routes.set(BACK_HASH, {show: this._back, hide: () => {}})
    window.addEventListener('hashchange', () => this._onNavigation());
  }


  register(component: any): void {
    this.routes.set(component.route, component);
  }

  addOnNavigationCallback(fn: NavigationCallback): void {
    this.onNavigationCallbacks.push(fn);
  }

  initNavigation(): void {
    const notInHomePage = window.location.hash !== HOME_HASH;
    notInHomePage ? navigateTo() : this._onNavigation(HOME_HASH);
  }

  private _back(): void {
    setTimeout(() => window.history.go(-2), 80);
  }

  private _onNavigation(hash: string = window.location.hash): void {
    const hashToNavigate = this.routes.has(hash) ? hash : '';

    this.routes.forEach((component, route) => {
      try {
        route === hashToNavigate ? component.show() : component.hide()
      } catch (e) {
        if (e instanceof TypeError) {
          throw new UnRoutableComponentError(component.constructor.name);
        } else {
          throw e;
        }
      }
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    this.onNavigationCallbacks.forEach(fn => fn(hashToNavigate));
  }
}

export class UnRoutableComponentError extends Error {
  name: string = 'UnRoutableComponentError';

  constructor(componentName: string) {
    super(`${componentName} does not implement Routable interface`);
  }
}

export function navigateTo(hash: string = HOME_HASH) {
  window.location.hash = hash;
}

export interface Routable {
  show: { (): void; };
  hide: { (): void; };
}

export type NavigationCallback = {(hash: string): void};

export default factory.make<Router>(Router);
