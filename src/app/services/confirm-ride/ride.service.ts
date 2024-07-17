import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
// import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RideService {
  constructor(private http: HttpClient) { }

  getConfirmedRides() {
    return this.http.get(`${environment.backendServerPORT}/confirmed-rides`);
  }

  cancelRide(requestId: string) {
    return this.http.post(`${environment.backendServerPORT}/rides/${requestId}/cancel`, {});
  }
}
