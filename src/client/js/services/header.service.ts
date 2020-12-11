import { Service } from "../base/service";
import { Injectable } from "../base/injectable";
import { addClass, removeClass } from '../DOM-utils/DOM-utils';

@Injectable({
  injectionToken: 'headerService',
  isSingleton: true
})
export default class HeaderService extends Service {

  private _headerEl: HTMLElement;
  private _navAnchorsEl: HTMLAnchorElement[];

  constructor() {
    super();
    this._headerEl = document.querySelector('header');
    this._navAnchorsEl = [...this._headerEl.querySelectorAll('a')];
  }

  static factoryFn(): HeaderService {
    return new HeaderService();
  }

  highlightNavigation(hash: string): void {
    requestAnimationFrame(() => {
      removeClass('visited', ...this._navAnchorsEl);
      const visited = this._navAnchorsEl.find(a => a.hash === hash);
      if (visited) {
        addClass('visited', visited);
      }
    })
  }
}
