import { TestBed } from '@angular/core/testing';

import { GooglemapsapiService } from './googlemapsapi.service';

describe('GooglemapsapiService', () => {
  let service: GooglemapsapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GooglemapsapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
