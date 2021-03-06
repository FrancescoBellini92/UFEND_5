import DynamicWebComponent from '../../base/dynamic.web.component';
import { Component } from '../../base/component';
import Trip, { TripDetail, TripDetailType } from '../../models/trip.model';
import { addClass, hide, removeClass, show } from '../../DOM-utils/DOM-utils';
import { SaveTripDetailsEvent } from '../../models/events';
import moment from 'moment';
import { Inject } from '../../base/inject';
import ToastService from '../../services/toast.service';
import { NotValidInputError } from '../../exceptions/exceptions';
import { Child } from '../../base/child';

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

  @Child('#form-control')
  private _formControlTemplate: HTMLTemplateElement;

  @Child('#details-container')
  private _detailsContainer: HTMLElement;

  @Child('#save-btn')
  private _saveDetailsBtn: HTMLElement;

  @Child('#remove-all-btn')
  private _removeAllBtn: HTMLElement;

  @Child('#add-detail-btn')
  private _addBtn: HTMLElement;

  @Child('#no-details-text')
  private _noDetailsText: HTMLElement;

  private _toastService: ToastService;

  private _handlerFnMap = {
    'remove-all-btn': () => {
      this.reset();
      this._onDetailsChanged();
    },
    'save-btn': () =>  this._onDetailsChanged()
  }

  private _start: string;
  private _end: string;

  constructor() {
    super();
  }

  get tripDetails(): TripDetail[] {
    const details: TripDetail[] = [];
    const detailElements = this.shadowRoot.querySelectorAll('.detail');
    requestAnimationFrame(() => removeClass('error', ...detailElements));

    detailElements.forEach(element => {
      const { typeEl, dateEl, contentEl } = this._getInputs(element);

      const date = dateEl.value;
      const content = contentEl.value;

      const isValidDate = moment(date).isSameOrAfter(this._start) && moment(date).isSameOrBefore(this._end);
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
    });

    return details;
  }

  updateProps(trip: Trip): void {
    this.reset();

    this._start = trip.general.start;
    this._end = trip.general.end;

    const fragment = document.createDocumentFragment();

    trip.details?.forEach(detail => {
      this._cloneTemplate(fragment as any);
      const { typeEl, dateEl, contentEl } = this._getInputs(fragment.lastElementChild as any);
      typeEl.value = detail.type;
      dateEl.value = detail.date;
      contentEl.value = detail.content;
    });

    requestAnimationFrame(() => {
      this._detailsContainer.appendChild(fragment);
      this._updateUI();
    })
  }

  reset(): void {
    this._detailsContainer.innerHTML = '';
    this._updateUI();
  }

  protected _attachEventHandlers(): void {
    this._saveDetailsBtn.addEventListener('click', () => this._onDetailsChanged());
    this._addBtn.addEventListener('click', () => this._addTemplate())
    this._removeAllBtn.addEventListener('click', () => {
      this.reset();
      this._onDetailsChanged();
    });

    this.shadowRoot.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      const isRemoveBtn = target.classList.contains('detail__remove');
      if (isRemoveBtn) {
        this._onRemoveDetail(target);
      }
    });
  }

  private _onDetailsChanged(): void {
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

  private _cloneTemplate(parentEl: Element = this._detailsContainer): void {
    const templateContent = this._formControlTemplate.content.cloneNode(true);
    parentEl.append(templateContent);
  }

  private _addTemplate(parentEl: Element = this._detailsContainer): void {
    const templateContent = this._formControlTemplate.content.cloneNode(true) as HTMLElement;
    const dateTimeInputEl = templateContent.firstElementChild.querySelector('.detail__date') as HTMLInputElement;
    dateTimeInputEl.value = `${this._start}T12:00`;
    requestAnimationFrame(() => {
      parentEl.prepend(templateContent);
      this._updateUI();
    });
  }

  private _getInputs(element: Element): { typeEl: HTMLInputElement, dateEl: HTMLInputElement, contentEl: HTMLInputElement } {
    const typeEl = element.querySelector('.detail__type') as HTMLInputElement;
    const dateEl = element.querySelector('.detail__date') as HTMLInputElement;
    const contentEl = element.querySelector('.detail__content') as HTMLInputElement;
    return { typeEl, dateEl, contentEl };
  }

  private _updateUI(hasDetails = this._detailsContainer.childElementCount): void {
    hasDetails ? hide(this._noDetailsText) : show(this._noDetailsText);
  }

  private _hightlightInvalidFields(el: HTMLElement): void {
    requestAnimationFrame(() => addClass('error', el));
  }
}
