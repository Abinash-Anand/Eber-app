import { TestBed } from '@angular/core/testing';

import { CreateRideService } from './create-ride.service';

describe('CreateRideService', () => {
  let service: CreateRideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateRideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
