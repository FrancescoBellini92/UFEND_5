import DynamicWebComponent from '../../base/dynamic.web.component';
import { Component } from '../../base/decorators';
import { TripDetail, TripDetailType } from '../../models/trip.model';
import { hide, show } from '../../DOM-utils/DOM-utils';
import { SaveTripDetailsEvent } from '../../models/events';

const template: string = require('./trip-detail.component.html');
const style: { default: string } = require('./trip-detail.component.scss');

@Component({
  selector: "trip-detail",
  template,
  hasShadow: true,
  style
})
export default class TripDetailComponent extends DynamicWebComponent {

  private _formControlTemplate: HTMLTemplateElement;
  private _detailsContainer: HTMLElement;
  private _saveDetailsBtn: HTMLElement;
  private _noDetailsText: HTMLElement;

  private _handlerFnMap = {
    'add-detail-btn': () => this._cloneTemplate(),
    'remove-all-btn': () => {
      this.reset();
      this._onDetailsChanged();
    },
    'save-btn': () =>  this._onDetailsChanged()

  }

  constructor() {
    super();
  }



  get tripDetails(): TripDetail[] {
    const details: TripDetail[] = [];
    const detailElements = this.shadowRoot.querySelectorAll('.detail');
    detailElements.forEach(node => {

      const { typeEl, dateEl, contentEl } = this._getInputs(node);

      const type = typeEl.value as TripDetailType;
      const date = dateEl.value;
      const content = contentEl.value;
      const allValid = type && date && content;
      if (allValid) {
        details.push({
          type: typeEl.value as TripDetailType,
          date: dateEl.value,
          content: contentEl.value
        });
      }
    })

    return details;
  }

  updateProps(details: TripDetail[]) {
    this.reset();

    details.forEach(detail => {
      this._cloneTemplate();
      const { typeEl, dateEl, contentEl } = this._getInputs(this._detailsContainer.lastElementChild);
      typeEl.value = detail.type;
      dateEl.value = detail.date;
      contentEl.value = detail.content;
    })

    this._updateUI();
  }

  reset(): void {
    this._detailsContainer.innerHTML = '';
    this._updateUI();
  }

  protected _queryTemplate(): void {
    this._formControlTemplate = this.shadowRoot.querySelector('#form-control');
    this._detailsContainer = this.shadowRoot.querySelector('#details-container');
    this._saveDetailsBtn= this.shadowRoot.querySelector('#save-btn');
    this._noDetailsText = this.shadowRoot.querySelector('#no-details-text');
  }

  protected _attachEventHandlers(): void {
    this.shadowRoot.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      const isRemoveBtn = target.classList.contains('remove');
      isRemoveBtn ? this._onRemoveDetail(target) : this._handlerFnMap[target.id]();
    });
  }

  private _onDetailsChanged() {
    const saveDetailsEvent = new SaveTripDetailsEvent('save-details', { detail: this.tripDetails, bubbles: true });
    this.dispatchEvent(saveDetailsEvent);
  }

  private _onRemoveDetail(target: HTMLElement): void {
    target.parentElement.parentElement.remove();
    this._onDetailsChanged();
  }

  private _cloneTemplate(): void {
    const templateContent = this._formControlTemplate.content.cloneNode(true);
    this._detailsContainer.appendChild(templateContent);
    show(this._detailsContainer.lastElementChild);
    this._updateUI();
  }

  private _getInputs(element: Element): { typeEl: HTMLInputElement, dateEl: HTMLInputElement, contentEl: HTMLInputElement } {
    const typeEl = element.querySelector('.detail-type') as HTMLInputElement;
    const dateEl = element.querySelector('.detail-date') as HTMLInputElement;
    const contentEl = element.querySelector('.detail-content') as HTMLInputElement;
    return { typeEl, dateEl, contentEl };
  }

  private _updateUI(hasDetails = this._detailsContainer.childElementCount): void {
    const updateUISaveDetailBtnFn = hasDetails ? show : hide;
    const updateUINoDetailsTextFn = hasDetails ? hide : show;
    updateUISaveDetailBtnFn(this._saveDetailsBtn);
    updateUINoDetailsTextFn(this._noDetailsText);
  }

}
