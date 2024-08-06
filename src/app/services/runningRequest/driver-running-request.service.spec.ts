import { TestBed } from '@angular/core/testing';

import { DriverRunningRequestService } from './driver-running-request.service';

describe('DriverRunningRequestService', () => {
  let service: DriverRunningRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverRunningRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
