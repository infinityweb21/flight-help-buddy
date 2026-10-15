import { TestBed } from '@angular/core/testing';

import { CruiseLineService } from './cruise-line.service';

describe('CruiseLineService', () => {
  let service: CruiseLineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CruiseLineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
