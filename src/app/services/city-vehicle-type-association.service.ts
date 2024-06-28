import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../shared/vehicle';
// import { Vehicle } from '../../shared/vehicle';

@Injectable({
  providedIn: 'root'
})
export class cityVehicleTypeService {
  vehicleDataArray: Vehicle[] = [];

  constructor(private http: HttpClient) { }

  // Get vehicle types by city
  getVehicleTypesByCity(cityId: string): Observable<Vehicle[]> {
    console.log(`Fetching vehicle types for city ID: ${cityId}`); // Debug log
    return this.http.get<Vehicle[]>(`http://localhost:5000/vehicle-types/by-city/${cityId}`);
  }
  
}


