import { TestBed } from '@angular/core/testing';

import { TopDestinationService } from './top-destination.service';

describe('TopDestinationService', () => {
  let service: TopDestinationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopDestinationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
