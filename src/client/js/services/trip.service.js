import Trip from "../models/trip.model";
import environment from '../environment';

const isProd = environment.MODE === 'PROD';

import {
  sendRequest,
  manageRequestResponse,
} from "../request-utils/request-utils";

export default class TripService {
  static STORAGE_TRIP_PROP = "trips";
  trips = [];
  currentTrip;

  constructor() {
    this.index();
  }

  static isEmpty(collection) {
    const hasNoItems = collection.length === 0;
    return collection ? hasNoItems : true;
  }

  index() {
    const savedTrips = JSON.parse(localStorage.getItem(TripService.STORAGE_TRIP_PROP));
    if (savedTrips && !TripService.isEmpty(savedTrips)) {
      this.trips = savedTrips;
    }
    return this.trips;
  }

  async add(name, start, end, location) {
    const request = await sendRequest(
      `${environment.APIURL}?name=${name}&start=${start}&end=${end}&location=${location}`,
      isProd
    );
    const response = await manageRequestResponse(request);
    const newTrip = new Trip(response);
    this.trips.unshift(newTrip);
    this._syncStorage();
    return newTrip;
  }

  delete(tripId) {
    this.trips = this.trips.filter((trip) => trip.general.id !== +tripId);
    if(TripService.isEmpty(this.trips)) {
      localStorage.removeItem('trips');
    }
    this._syncStorage();
  }

  edit() {
    // TODO
  }

  _syncStorage() {
    localStorage.setItem(TripService.STORAGE_TRIP_PROP, JSON.stringify(this.trips));
  }

}
