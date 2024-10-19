import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class TripControlServiceService {

  constructor(private http: HttpClient) { }
  
  updateBookingStatus(request:any): Observable<any>{
      return this.http.patch<any>(`${environment.backendServerPORT}/update-status`, request, {observe:'response'})
  }
  calculateInvoice(bookingIdInvoice:any): Observable<any>{
    return this.http.post<any>(`${environment.backendServerPORT}/calculate-invoice/${bookingIdInvoice}`, {observe:'response'})
  }
  submitFeedback(feedback:any, invoiceId:string): Observable<any>{
    return this.http.patch<any>(`${environment.backendServerPORT}/submit-feedback/${invoiceId}`,feedback, {observe:'response'} )
  }

  

}
