export default interface Trip {
  id: number;

  general: {
    start: string,
    end: string,
    location: string,
    name: string
  };

  geo: {
    name: string,
    countryName: string,
    lng: string,
    lat: string
  };

  pix: {
    webformatURL: string
  };

  weather: Weather[];

  details?: TripDetail[]

  error?: string;

}

export interface Weather {
  temp: string;
  valid_date: string;
  weather: {
    icon: string;
    description: string;
  }
}

export interface TripDetail {
  type: TripDetailType,
  date: string;
  content: string
}

export interface DayInfo {
  weather?: Weather;
  details?: TripDetail[]
}

export enum TripDetailType {
  TODO = 'todo',
  STAY = 'stay',
  TRAVEL = 'travel'
}