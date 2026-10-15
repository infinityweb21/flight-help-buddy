export enum Package {
  FlightHotel = 'Flight Hotel',
  FlightCar = 'Flight Car',
}
// export type TravelOption = 'Flight' | 'Hotel' | 'Cruises' | 'Car';

// export const TravelOptions: TravelOption[] = ['Flight', 'Hotel','Cruises' ,'Car'];

export type TravelOptionType = 'Flight' | 'Hotel'| 'Cruises'  | 'Car';

export interface TravelOption {
  label: TravelOptionType;
  icon: string;
}


