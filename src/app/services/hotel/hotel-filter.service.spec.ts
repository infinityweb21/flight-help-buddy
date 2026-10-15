import { TestBed } from '@angular/core/testing';

import { HotelFilterService } from './hotel-filter.service';

describe('HotelFilterService', () => {
  let service: HotelFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
