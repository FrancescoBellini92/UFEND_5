import Trip from "../models/trip.model";
import environment from '../environment';
import { Service } from '../base/service';

import {
  sendRequest,
  manageRequestResponse,
} from "../request-utils/request-utils";
import TripRequest from "../models/trip.request";
import { Injectable } from "../base/service";

const isProd = environment.MODE === 'PROD';

@Injectable({
  injectionToken: 'tripService',
  isSingleton: true
})
export default class TripService extends Service{
  static STORAGE_TRIP_PROP = "trips";
  trips = [];
  currentTrip;

  constructor() {
    super();
    this.index();
  }

  static factoryFn(): TripService {
    return new TripService();
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

  async add(tripRequest: TripRequest) {
    const { name, startDate, endDate, location } = tripRequest;
    const request = await sendRequest(
      `${environment.APIURL}?name=${name}&start=${startDate}&end=${endDate}&location=${location}`,
      isProd
    );
    const newTrip: Trip = await manageRequestResponse<Trip>(request);
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
