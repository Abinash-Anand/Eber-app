import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {

  constructor(private http:HttpClient) { }
  //---create  a bank account
  createNewBankAccount(driverId:any, bankDetails:any): Observable<any>{
    return this.http.post<any>(`${environment.backendServerPORT}/driver/stripe/create/express/account/${driverId}`, bankDetails, {observe:'response'})
  }
  updateStripeAccount(driverId, accountData): Observable<HttpResponse<any>>{
    return this.http.patch<any>(`${environment.backendServerPORT}/driver/account/stripe/update/${driverId}`,accountData, {observe:"response"} )
  }
  
}
