export interface FlightSearchRequest {
  DepartureLocationCode?: string;
  ArrivalLocationCode?: string;
  DepartureTime?: string; 
  returnDate?: string;
  CabinClass?: string; 
  NoOfAdults?: number;
  NoOfChildren?: number;
  NoOfInfants?: number;
  tripType?: string;
  source?: string; 
  CurrencyCode?: string;
  MarketingAirlineName?: string;
  providers?: string;
  maxResultsPerProvider?: number;
  limit?: number;
}
