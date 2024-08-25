import { HttpClient } from '@angular/common/http';
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
    return this.http.post<any>(`${environment.backendServerPORT}/driver/create/bank_account/${driverId}`, bankDetails, {observe:'response'})
  }
}
