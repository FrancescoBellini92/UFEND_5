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

  constructor() {
    this.index();
  }

  index() {
    const savedTrips = JSON.parse(localStorage.getItem(TripService.STORAGE_TRIP_PROP));
    this.trips = savedTrips;
  }

  async add(name, start, end, location) {
    const request = await sendRequest(
      `${environment.APIURL}?name=${name}&start=${start}&end=${end}&location=${location}`,
      isProd
    );
    const response = await manageRequestResponse(request);
    const newTrip = new Trip(response);
    this.trips = this.trips.concat(newTrip);
    this._syncStorage();
    return this.trip;
  }

  delete(tripId) {
    this.trip = this.trips.filter((trip) => trip.id !== +tripId);
    this._syncStorage();
  }

  edit() {
    // TODO
  }

  _syncStorage() {
    localStorage.setItem(TripService.STORAGE_TRIP_PROP, JSON.stringify(this.trips));
  }

}
