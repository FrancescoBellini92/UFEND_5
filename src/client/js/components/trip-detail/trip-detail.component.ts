import DynamicWebComponent from '../../base/dynamic.web.component';
import { Component } from '../../base/decorators';
import { TripDetail, TripDetailType } from '../../models/trip.model';

const template: string = require('./trip-detail.component.html');
const style: { default: string } = require('./trip-detail.component.scss');

@Component({
  selector: "trip-detail",
  template,
  hasShadow: true,
  style
})
export default class TripDetailComponent extends DynamicWebComponent {

  formControlTemplate: HTMLTemplateElement;
  detailsContainer: HTMLElement;

  constructor() {
    super();
  }

  get tripDetails(): TripDetail[] {
    const details: TripDetail[] = [];
    const detailElements = this.shadowRoot.querySelectorAll('.detail');
    detailElements.forEach(node => {

      const { typeEl, dateEl, contentEl } = this._getInputs(node);

      details.push({
        type: typeEl.value as TripDetailType,
        date: dateEl.value,
        content: contentEl.value
      });
    })

    return details;
  }

  private _getInputs(node: Element) {
    const typeEl = node.querySelector('.detail-type') as HTMLInputElement;
    const dateEl = node.querySelector('.detail-date') as HTMLInputElement;
    const contentEl = node.querySelector('.detail-content') as HTMLInputElement;
    return { typeEl, dateEl, contentEl };
  }

  updateProps(details: TripDetail[]) {
    details.forEach(detail => {
      const templateContent = this.formControlTemplate.content.cloneNode(true);


          if (this.detailsContainer.firstElementChild) {
            this.detailsContainer.firstElementChild.before(templateContent);
          } else {
            this.detailsContainer.appendChild(templateContent);
          }
          const { typeEl, dateEl, contentEl } = this._getInputs(this.detailsContainer.firstElementChild);

          typeEl.value = detail.type;
          dateEl.value = detail.date;
          contentEl.value = detail.content;

    })
  }

  reset(): void {
    this.detailsContainer.innerHTML = '';
  }

  protected _queryTemplate(): void {
    this.formControlTemplate = this.shadowRoot.querySelector('#form-control');
    this.detailsContainer = this.shadowRoot.querySelector('#details-container');
  }

  protected _attachEventHandlers(): void {
    this.shadowRoot.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      const isRemoveBtn = target.classList.contains('remove');
      const isAddBtn = target.id === 'add-detail-btn';
      if (isRemoveBtn) {
        target.parentElement.parentElement.remove();
      } else if (isAddBtn) {
        const templateContent = this.formControlTemplate.content.cloneNode(true);
        if (this.detailsContainer.firstElementChild) {
          this.detailsContainer.firstElementChild.before(templateContent);
        } else {
          this.detailsContainer.appendChild(templateContent);
        }
      }
    });
  }

}
