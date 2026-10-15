import { TestBed } from '@angular/core/testing';

import { RouteListnerHotelService } from './route-listner-hotel.service';

describe('RouteListnerHotelService', () => {
  let service: RouteListnerHotelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteListnerHotelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
