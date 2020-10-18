import WebComponent from "../../base/web.component";
import TripCardComponent from '../trip-card/trip-card.component';
import { hide, show } from "../../DOM-utils/DOM-utils";
import Trip from "../../models/trip.model";
import { Component } from "../../base/decorators";

const template: string = require("./home-page.component.html");

@Component({
  selector:"home-page",
  template
})
export default class HomePageComponent extends WebComponent {

  private _emptyContainer: HTMLElement;
  private _homeTitle: HTMLElement;
  private _cardContainer: HTMLElement;

  private _cardTripMap = new Map();

  constructor() {
    super();
    this._init();
  }

  static define(): void {
    super.define(HomePageComponent);
  }

  show(): void {
    this.updateUIOnRemove();
    show(this.firstElementChild);
  }

  updateUIOnRemove(dataSize: number = this._cardTripMap.size): void {
    const hasProps = dataSize > 0;
    if (hasProps) {
      hide(this._emptyContainer);
      show(this._homeTitle);
    }
  }

  hide(): void {
    hide(this.firstElementChild);
  }

  updateProps(data: Trip[]): void {
    const fragment = document.createDocumentFragment();
    data.forEach(item => {
      const tripCard = new TripCardComponent();
      this._cardTripMap.set(item.general.id, tripCard);
      tripCard.updateProps(item)
      fragment.appendChild(tripCard);
    });
    this._cardContainer.insertBefore(fragment, this._cardContainer.firstChild);
  }

  onRemove(id: number): void {
    const element = this._cardTripMap.get(id);
    element.remove();
    this.updateUIOnRemove();
  }

  protected _queryTemplate(): void {
    this._emptyContainer = this.querySelector('#empty-container');
    this._homeTitle = this.querySelector('#home-title');
    this._cardContainer = this.querySelector('#card-container');
  }

  protected _attachEventHandlers(): void {}
}

function viewChild(selector) {
  return (target, name, descriptor) => {
    descriptor.childSelector = selector;
    debugger;
    return descriptor;
  }

}