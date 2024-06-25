import { TestBed } from '@angular/core/testing';

import { DriverlistService } from './driverlist.service';

describe('DriverlistService', () => {
  let service: DriverlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
