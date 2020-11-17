import Trip, { DayInfo, TripDetail } from "../models/trip.model";
import environment from '../environment';
import { Service } from '../base/service';

import {
  sendRequest,
  manageRequestResponse,
} from "../request-utils/request-utils";
import TripRequest from "../models/trip.request";
import { Injectable } from "../base/service";
import Observable from "../base/observable";
import moment from "moment";

const isProd = environment.MODE === 'PROD';

@Injectable({
  injectionToken: 'tripService',
  isSingleton: true
})
export default class TripService extends Service{
  static STORAGE_TRIP_PROP = "trips";

  currentTrip$: Observable<Trip, Trip> = new Observable<Trip, Trip>(async(trip: Trip) => trip);
  onTripAdded$: Observable<Trip, Trip> = new Observable<Trip, Trip>(async(trip: Trip) => trip);
  onTripEdited$: Observable<Trip, Trip> = new Observable<Trip, Trip>(async(trip: Trip) => trip);
  onTripDeleted$: Observable<number, number> = new Observable<number, number>(async tripId => tripId);

  private _currentTrip: Trip;

  private _trips: Trip[] = [];
  private _tripMap: Map<number, Trip> = new Map<number, Trip>();

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


  static getDayInfo(trip: Trip): DayInfo[] {
    const dayMap: Map<string, DayInfo> = new Map<string, DayInfo>();
    trip.details?.forEach(detail => {
      const { dayData, dayKey } = TripService._getDayDataAndKey(detail.date, dayMap);
      dayData.details = (dayData.details?? []).concat(detail);
      dayMap.set(dayKey, dayData);
    });
    trip.weather?.forEach(weatherInfo => {
      const { dayData, dayKey } = TripService._getDayDataAndKey(weatherInfo.valid_date, dayMap);
      dayData.weather = weatherInfo;
      dayMap.set(dayKey, dayData);
    });
    const accumulator = [];
    dayMap.forEach(value => {
      value.details = value.details?.sort((firstDetail, secondDetail) => moment(firstDetail.date).diff(secondDetail.date));
      accumulator.push(value)
    });
    return accumulator;
  }


  private static _getDayDataAndKey(date: string, dayMap: Map<string, DayInfo>): { dayData: DayInfo, dayKey: string } {
    const dayKey = moment(date).format('L');
    const dayData = dayMap.get(dayKey) ?? {};
    return { dayData, dayKey };
  }

  set trips(trips: Trip[]) {
    this._trips = trips;
    this._trips.forEach(trip => this._tripMap.set(trip.id, trip));
  }

  get trips(): Trip[] {
    return this._trips;
  }

  set currentTrip(value: Trip) {
    this._currentTrip = value;
    this.currentTrip$.next(this._currentTrip);
  }

  get currentTrip(): Trip {
    return this._currentTrip;
  }

  setCurrentTripById(id: number) {
    this.currentTrip = this._tripMap.get(id);
  }

  index(): Trip[] {
    const savedTrips = JSON.parse(localStorage.getItem(TripService.STORAGE_TRIP_PROP));
    if (savedTrips && !TripService.isEmpty(savedTrips)) {
      this.trips = savedTrips;
    }
    return this.trips;
  }

  async add(tripRequest: TripRequest): Promise<Trip> {
    const newTrip: Trip = await this._sendRequest(tripRequest);
    newTrip.id = new Date().getTime();
    this.trips = [newTrip, ...this.trips]
    this._syncStorage();
    this.currentTrip = newTrip
    this.onTripAdded$.next(newTrip);
    return newTrip;
  }

  async edit(tripRequest: TripRequest) {
    const newTrip: Trip = await this._sendRequest(tripRequest);
    newTrip.id = this.currentTrip.id;
    newTrip.details = this.currentTrip.details;
    this.currentTrip = newTrip;
    this.onTripEdited$.next(this.currentTrip);
    this.trips = this.trips.map(trip => trip.id === this.currentTrip.id ? this.currentTrip : trip);
    this._syncStorage();
  }

  editDetails(details: TripDetail[]): void {
    this._currentTrip.details = details;
    this.currentTrip  = this._currentTrip;
    this._syncStorage();
  }

  delete(tripId: number): void {
    this.trips = this.trips.filter((trip) => trip.id !== +tripId);
    if(TripService.isEmpty(this.trips)) {
      localStorage.removeItem('trips');
    }
    this._syncStorage();
    this.onTripDeleted$.next(tripId);
  }

  private async _sendRequest(tripRequest: TripRequest): Promise<Trip> {
    const { name, start, end, location } = tripRequest;
    const request = await sendRequest(
      `${environment.APIURL}?name=${name}&start=${start}&end=${end}&location=${location}`,
      isProd
    );
    const newTrip: Trip = await manageRequestResponse<Trip>(
      request
    );
    return newTrip;
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
