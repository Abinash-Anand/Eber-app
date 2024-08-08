import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class TripControlServiceService {

  constructor(private http: HttpClient) { }
  
  updateBookingStatus(bookingId:string, status:string): Observable<any>{
      return this.http.patch<any>(`${environment.backendServerPORT}/update-status/${bookingId}`, status, {observe:'response'})
  }
  calculateInvoice(invoice): Observable<any>{
    return this.http.post<any>(`${environment.backendServerPORT}/calculate-invoice`, invoice, {observe:'response'})
  }
  submitFeedback(feedback): Observable<any>{
    return this.http.post<any>(`${environment.backendServerPORT}/submit-feedback`,feedback, {observe:'response'} )
  }
}
