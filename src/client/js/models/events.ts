import TripListComponent from "../components/trip-list/trip-list.component";
import TripRequest from "./trip.request";
import Trip from "./trip.model";

export class RemoveListItemEvent extends CustomEvent<{idToRemove: number, element: TripListComponent}> {}

export class RemoveTripEvent extends CustomEvent<number> {}
export class SelectTripEvent extends CustomEvent<Trip> {}

export class SubmitTripEvent extends CustomEvent<TripRequest> {}
