import { TestBed } from '@angular/core/testing';

import { CityVehicleTypeAssociationService } from './city-vehicle-type-association.service';

describe('CityVehicleTypeAssociationService', () => {
  let service: CityVehicleTypeAssociationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CityVehicleTypeAssociationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
