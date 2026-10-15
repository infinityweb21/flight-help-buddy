import { TestBed } from '@angular/core/testing';

import { CommonListnerService } from './common-listner.service';

describe('CommonListnerService', () => {
  let service: CommonListnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonListnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
