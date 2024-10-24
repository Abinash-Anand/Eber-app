import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }
  notificationSubscription(subscription:any):Observable<any> {
    return this.http.post<any>(`${environment.backendServerPORT}/save-subscription`, subscription,{observe:'response'})
  }
}
