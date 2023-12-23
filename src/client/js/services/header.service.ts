import { Injectable } from "../base/injectable";
import { addClass, removeClass } from '../DOM-utils/DOM-utils';

@Injectable({
  isSingleton: true
})
export default class HeaderService {

  private _headerEl: HTMLElement;
  private _navAnchorsEl: HTMLAnchorElement[];

  constructor() {
    this._headerEl = document.querySelector('header');
    this._navAnchorsEl = [...this._headerEl.querySelectorAll('a')];
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
