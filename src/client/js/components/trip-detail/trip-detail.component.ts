import DynamicWebComponent from '../../base/dynamic.web.component';
import { Component } from '../../base/decorators';
import Trip, { TripDetail, TripDetailType } from '../../models/trip.model';
import { addClass, hide, inputNotValid, removeClass, show } from '../../DOM-utils/DOM-utils';
import { SaveTripDetailsEvent } from '../../models/events';
import moment from 'moment';
import { Inject } from '../../base/inject';
import ToastService from '../../services/toast.service';
import { NotValidInputError } from '../../exceptions/exceptions';

const template: string = require('./trip-detail.component.html');
const style: { default: string } = require('./trip-detail.component.scss');

@Inject(
  {
    injectionToken: ToastService.injectionToken,
    nameAsDependency: '_toastService'
  }
)
@Component({
  selector: "trip-detail",
  template,
  hasShadowDom: true,
  style
})
export default class TripDetailComponent extends DynamicWebComponent {

  start: string;
  end: string;

  private _formControlTemplate: HTMLTemplateElement;
  private _detailsContainer: HTMLElement;
  private _saveDetailsBtn: HTMLElement;
  private _noDetailsText: HTMLElement;

  private _toastService: ToastService;

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
    removeClass('error', ...detailElements)
    for (const node of detailElements) {

      const { typeEl, dateEl, contentEl } = this._getInputs(node);

      const type = typeEl.value as TripDetailType;
      const date = dateEl.value;
      const content = contentEl.value;

      const isValidDate = moment(date).isSameOrAfter(this.start) && moment(date).isSameOrBefore(this.end);
      const allValid = isValidDate && content;

      if (!allValid)  {
        const invalidNode = !content ? contentEl : dateEl;
        this._hightlightInvalidFields(invalidNode as HTMLElement);
        throw new NotValidInputError(!content ? 'Please fill the content field' : 'Selected date is out of trip date range');
      }
      details.push({
        type: typeEl.value as TripDetailType,
        date: dateEl.value,
        content: contentEl.value
      });
    }

    return details;
  }

  updateProps(trip: Trip) {
    this.reset();

    this.start = trip.general.start;
    this.end = trip.general.end;

    trip.details?.forEach(detail => {
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
      const isRemoveBtn = target.classList.contains('detail__remove');
      isRemoveBtn ? this._onRemoveDetail(target) : this._handlerFnMap[target.id]();
    });
  }

  private _onDetailsChanged() {
    try {
      const saveDetailsEvent = new SaveTripDetailsEvent('save-details', { detail: this.tripDetails, bubbles: true });
      this.dispatchEvent(saveDetailsEvent);
    } catch (e) {
      if (e instanceof NotValidInputError) {
        this._toastService.showDanger('Please fill empty fields and check the dates');
      } else {
        throw e;
      }
    }
  }

  private _onRemoveDetail(target: HTMLElement): void {
    target.parentElement.parentElement.remove();
    const allDeleted = this._detailsContainer.childElementCount === 0;
    if (allDeleted) {
      this._handlerFnMap["remove-all-btn"]();
    }
  }

  private _cloneTemplate(): void {
    const templateContent = this._formControlTemplate.content.cloneNode(true);
    this._detailsContainer.appendChild(templateContent);
    show(this._detailsContainer.lastElementChild);
    this._updateUI();
  }

  private _getInputs(element: Element): { typeEl: HTMLInputElement, dateEl: HTMLInputElement, contentEl: HTMLInputElement } {
    const typeEl = element.querySelector('.detail__type') as HTMLInputElement;
    const dateEl = element.querySelector('.detail__date') as HTMLInputElement;
    const contentEl = element.querySelector('.detail__content') as HTMLInputElement;
    return { typeEl, dateEl, contentEl };
  }

  private _updateUI(hasDetails = this._detailsContainer.childElementCount): void {
    const updateUISaveDetailBtnFn = hasDetails ? show : hide;
    const updateUINoDetailsTextFn = hasDetails ? hide : show;
    updateUISaveDetailBtnFn(this._saveDetailsBtn);
    updateUINoDetailsTextFn(this._noDetailsText);
  }

  private _hightlightInvalidFields(el: HTMLElement): void {
    addClass('error', el);
  }
}
