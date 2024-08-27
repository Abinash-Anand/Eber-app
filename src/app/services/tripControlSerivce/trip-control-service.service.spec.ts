import { TestBed } from '@angular/core/testing';

import { TripControlServiceService } from './trip-control-service.service';

describe('TripControlServiceService', () => {
  let service: TripControlServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripControlServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
