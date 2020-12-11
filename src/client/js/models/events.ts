import TripRequest from "./trip.request";
import { TripDetail } from "./trip.model";

export class RemoveTripEvent extends CustomEvent<number> {}
export class SelectTripEvent extends CustomEvent<number> {}

export class SubmitTripEvent extends CustomEvent<TripRequest> {}
export class SaveTripDetailsEvent extends CustomEvent<TripDetail[]> {}

export class DialogEvent extends CustomEvent<boolean> {}