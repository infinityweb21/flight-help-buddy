import { TestBed } from '@angular/core/testing';

import { CanonicalsService } from './canonicals.service';

describe('CanonicalsService', () => {
  let service: CanonicalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanonicalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
