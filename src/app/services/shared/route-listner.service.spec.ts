import { TestBed } from '@angular/core/testing';

import { RouteListnerService } from './route-listner.service';

describe('RouteListnerService', () => {
  let service: RouteListnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteListnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
