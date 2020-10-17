import TripListComponent from "../components/trip-list/trip-list.component";
import TripRequest from "./trip.request";
import Trip from "./trip.model";

export class ListRemoveEvent extends CustomEvent<{idToRemove: number, element: TripListComponent}> {}

export class CardRemoveEvent extends CustomEvent<number> {}

export class CardViewEvent extends CustomEvent<Trip> {}

export class AddFormSubmitEvent extends CustomEvent<TripRequest> {}