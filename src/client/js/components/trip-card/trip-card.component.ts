import Trip from '../../models/trip.model';
import DynamicWebComponent from '../../base/dynamic.web.component';

import { hide } from '../../DOM-utils/DOM-utils';
import { RemoveTripEvent, SelectTripEvent } from '../../models/events';
import { Component } from '../../base/component';

import { Effect } from '../../base/effect';

const template: string = require('./trip-card.component.html');
const style: { default: string } = require('./trip-card.component.scss');

@Component({
	selector: 'trip-card',
	template,
	hasShadowDom: true,
	style,
})
export default class TripCardComponent extends DynamicWebComponent {
	private static _DEFAULT_IMG_PATH = '/src/assets/images/default.jpg';

	@Effect({onChange() {
		this.trip && this.updateProps(JSON.parse(JSON.stringify((this.trip))));
	}})
	public trip: Trip;


	@Effect()
	public tripImage: any = { classList: [], loaded: false };


	hideChildren(selector: string): void {
		const element = this.shadowRoot.querySelector(selector);
		requestAnimationFrame(() => hide(element));
	}

	updateProps(trip: Trip) {
		trip.general.start = !isNaN(new Date(trip.general.start).getTime()) ?  new Date(trip.general.start).toLocaleDateString() : trip.general.start;
		trip.general.end = !isNaN(new Date(trip.general.end).getTime()) ?  new Date(trip.general.end).toLocaleDateString() : trip.general.end;

		this.trip = trip;
		this._addPicture(this.trip.pix.webformatURL);
	}



	handleRemove() {
		const removeEvent = new RemoveTripEvent('remove', { detail: this.trip.id, bubbles: true });
		requestAnimationFrame(() => hide(this));
		this.dispatchEvent(removeEvent);
	}

	handleView() {
		const viewEvent = new SelectTripEvent('view', { detail: this.trip.id, bubbles: true });
		this.dispatchEvent(viewEvent);
	}

	handleEdit() {
		const editEvent = new SelectTripEvent('edit', { detail: this.trip.id, bubbles: true });
		this.dispatchEvent(editEvent);
	}

	protected _attachEventHandlers(): void {
		// this._shadowRoot.addEventListener('click', e => this._onClick(e) )
	}

	public handleImageLoad() {
		this.tripImage = {...this.tripImage, loaded: true} ;
	}
	public handleImageError() {
		this.tripImage.src = TripCardComponent._DEFAULT_IMG_PATH;
	}

	private _addPicture(pix: string): void {
		this.tripImage = {
			...this.tripImage,
			src: `data:image/png;base64,${pix}`,
			classList: ['card__img', 'can-hide-present'],
		}
	}
}

