import Trip from "../models/trip.model";
import environment from '../environment';
import { Service } from '../base/service';

import {
  sendRequest,
  manageRequestResponse,
} from "../request-utils/request-utils";
import TripRequest from "../models/trip.request";
import { Injectable } from "../base/service";
import Observable from "../base/observable";

const isProd = environment.MODE === 'PROD';

@Injectable({
  injectionToken: 'tripService',
  isSingleton: true
})
export default class TripService extends Service{
  static STORAGE_TRIP_PROP = "trips";
  trips: Trip[] = [];

  currentTrip$: Observable<Trip, Trip> = new Observable<Trip, Trip>(async(trip: Trip) => trip);
  onTripAdded$: Observable<Trip, Trip> = new Observable<Trip, Trip>(async(trip: Trip) => trip);

  private _currentTrip: Trip;

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

  set currentTrip(value: Trip) {
    this._currentTrip = value;
    this.currentTrip$.next(this._currentTrip);
  }

  get currentTript(): Trip {
    return this._currentTrip;
  }

  index(): Trip[] {
    const savedTrips = JSON.parse(localStorage.getItem(TripService.STORAGE_TRIP_PROP));
    if (savedTrips && !TripService.isEmpty(savedTrips)) {
      this.trips = savedTrips;
    }
    return this.trips;
  }

  async add(tripRequest: TripRequest): Promise<Trip> {
    const { name, startDate, endDate, location } = tripRequest;
    const request = await sendRequest(
      `${environment.APIURL}?name=${name}&start=${startDate}&end=${endDate}&location=${location}`,
      isProd
    );
    const newTrip: Trip = await manageRequestResponse<Trip>(
      request,
      // request => request.status === 400,
      // async request => {
      //   const { error } = await request.json();
      //   throw new BadRequestError(error);
      // }
    );
    this.trips.unshift(newTrip);
    this.onTripAdded$.next(newTrip);
    this._syncStorage();
    this.currentTrip = newTrip
    return newTrip;
  }

  delete(tripId: number): void {
    this.trips = this.trips.filter((trip) => trip.general.id !== +tripId);
    if(TripService.isEmpty(this.trips)) {
      localStorage.removeItem('trips');
    }
    this._syncStorage();
  }

  edit() {
    // TODO
  }

  private _syncStorage(): void {
    localStorage.setItem(TripService.STORAGE_TRIP_PROP, JSON.stringify(this.trips));
  }

}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}
