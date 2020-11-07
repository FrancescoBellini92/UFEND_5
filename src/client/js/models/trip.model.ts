export default interface Trip {
  general: {
    id: number,
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
    pageURL: string,
    previewURL: string,
    webformatURL: string
  };

  weather: {
    temp: string,
    valid_date: string,
    weather: {
        icon: string,
        description: string
    }
  }[];

  details: TripDetail[]

  error?: string;

}

export interface TripDetail {
  type: TripDetailType,
  date: string;
  content: string
}

export enum TripDetailType {
  TODO = 'todo',
  STAY = 'stay',
  TRAVEL = 'travel'
}