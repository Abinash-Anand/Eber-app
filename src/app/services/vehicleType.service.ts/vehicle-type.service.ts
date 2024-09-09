import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Vehicle } from '../../shared/vehicle';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeService {
  vehicleDataArray: Vehicle[] = [];
  vehicleTypeArray: {vehicleType: string}[]=[]
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
updateVehicleDetails(vehicleId: string, updateData: { type: string, image: File | string }): Observable<any> {
  const url = `http://localhost:5000/update-vehicle-data/${vehicleId}`;
  
  const formData = new FormData();
  formData.append('type', updateData.type);
  
  // If image is a File, append it, otherwise append base64 image directly
  if (updateData.image instanceof File) {
    formData.append('image', updateData.image);
  } else {
    formData.append('image', updateData.image);
  }

  return this.http.patch<any>(url, formData); // Use POST to send the updated vehicle details
}

    getVehicleTypesByCity(cityId: string): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`http://localhost:5000/vehicle-types/${cityId}`);
  }

checkSpecificVehicleType(vehicleType: string): Observable<HttpResponse<any>> {
  return this.http.get<any>(`${environment.backendServerPORT}/pricing/vehicles-type/check/${vehicleType}`, { observe: 'response' })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle error and rethrow it
        console.error('Error occurred:', error);
        return throwError(() => new Error('Failed to check vehicle type. Please try again later.'));
      })
    );
}
  getAllVehicles(): Observable<HttpResponse<any>>{
    return this.http.get(`${environment.backendServerPORT}/pricing/vehicles/vehiles-list`, {observe:'response'})
  }
}
