import { TestBed } from '@angular/core/testing';

import { TopRoutesService } from './top-routes.service';

describe('TopRoutesService', () => {
  let service: TopRoutesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopRoutesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
