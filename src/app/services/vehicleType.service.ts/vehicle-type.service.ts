import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from '../../shared/vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeService {
  vehicleDataArray: Vehicle[] = [];

  constructor(private http: HttpClient) { }
    convertFileToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error); // Fixed typo here
    });
      
  }
   onGetVehicle(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`http://localhost:5000/req-vehicle-data`)
  }

}
