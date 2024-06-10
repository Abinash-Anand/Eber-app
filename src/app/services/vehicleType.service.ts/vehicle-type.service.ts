import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeService {
  vehicleDataArray: Array<{ name: string, type: string, image: string }> = [];

  constructor(private http: HttpClient) { }
    convertFileToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error); // Fixed typo here
    });
      
      //Post request to the server to store the data of the vehicle type
  //    submitVehicleType(vehicleName: string, vehicleType: string, vehicleImage: File) {
  //   const formData = new FormData();
  //   formData.append('vehicleName', vehicleName);
  //   formData.append('vehicleType', vehicleType);
  //   formData.append('vehicleImage', vehicleImage);

  //   return this.http.post<any>('http://localhost:5000/submit-vehicle-type', formData);
  // }
  }
}
