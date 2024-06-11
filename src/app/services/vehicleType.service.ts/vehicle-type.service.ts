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
  //Send data to server
  submitVehicleType(formData: FormData): Promise<any> {
    return this.http.post('http://localhost:5000/submit-vehicle-type', formData).toPromise();
  }

  //Get data from server
   onGetVehicle(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`http://localhost:5000/req-vehicle-data`)
  }

  //update data request to server
  updateVehicleDetails(index: string, updateData: {name:string, type:string}) {
  const url = `http://localhost:5000/update-vehicle-data/${index}`;
  return this.http.patch<any[]>(url, updateData);
}


}
