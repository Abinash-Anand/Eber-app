import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateRideForm } from '../../shared/create-ride-form';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class CreateRideService {
constructor(private http: HttpClient) { }

  bookRide(rideDetails: CreateRideForm): Observable<CreateRideForm[]> {
    return this.http.post<CreateRideForm[]>(`${environment.backendServerPORT}/book-ride`, rideDetails);
  }
}
