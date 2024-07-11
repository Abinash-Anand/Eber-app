import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateRideService {
constructor(private http: HttpClient) { }

  bookRide(rideDetails: any): Observable<any> {
    return this.http.post('/api/rides', rideDetails);
  }
}
