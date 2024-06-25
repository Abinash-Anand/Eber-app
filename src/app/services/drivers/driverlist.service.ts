import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class DriverlistService {

  constructor(private http: HttpClient) { }
  postDriversData(driversObject): Observable<HttpResponse<any>>{
    return this.http.post<any>(`${environment.backendServerPORT}/create-driver`, driversObject, { observe:'response'})
  }
}
