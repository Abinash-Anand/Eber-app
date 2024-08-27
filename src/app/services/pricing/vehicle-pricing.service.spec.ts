import { TestBed } from '@angular/core/testing';

import { VehiclePricingService } from './vehicle-pricing.service';

describe('VehiclePricingService', () => {
  let service: VehiclePricingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehiclePricingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
