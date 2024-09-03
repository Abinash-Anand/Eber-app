// ride.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { Ride } from '../../shared/ride';

@Injectable({
  providedIn: 'root'
})
export class RideService {

  private apiUrl = `${environment.backendServerPORT}`;

  constructor(private http: HttpClient) { }

  getConfirmedRides(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/confirmed-rides`);
  }
  
  updateRideStatus(rideId: string, ride): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/update-ride-status/${rideId}`, ride);
  }

  cancelRide(rideId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/cancel-ride/${rideId}`,{observe:'response'});
  }
  submitRideRequestData(rideRequest: Ride):Observable<HttpResponse<Ride[]>> {
   return this.http.post<Ride[]>(`${environment.backendServerPORT}/create/new/ride-booking`, rideRequest, {observe:'response'}) 
  }
 getAcceptedRides(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.backendServerPORT}/ride-bookings/accepted-rides`);
  }

}
