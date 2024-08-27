import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class RideService {
 

  constructor(private http: HttpClient) {}

  getConfirmedRides(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.backendServerPORT}/confirmed-rides`);
  }

  cancelRide(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.backendServerPORT}/cancel-ride/${id}`);
  }

  assignDriver(rideId: string, driverId: string): Observable<any> {
    return this.http.put<any>(`${environment.backendServerPORT}/assign-driver/${rideId}`, { driverId });
  }

  updateRideStatus(id: string, status: string): Observable<any> {
    return this.http.put<any>(`${environment.backendServerPORT}/ride-status/${id}`, { status });
  }

  filterRides(filters: any): Observable<any[]> {
    return this.http.get<any[]>(`${environment.backendServerPORT}/filter-rides`, { params: filters });
  }
}
