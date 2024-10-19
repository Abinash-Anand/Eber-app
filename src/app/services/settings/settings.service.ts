import { Injectable } from '@angular/core';
import { Settings } from '../../shared/settings';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
settingArray:[Settings]
  constructor(private http:HttpClient) { 
    this.settingArray = [{ id:"DEFAULT", requestAcceptTime: 30, numberOfStops: 2 }];
  }
  postDefaultSettings(settingsObject):Observable<HttpResponse<Settings[]>> {
  return this.http.post<Settings[]>(`${environment.backendServerPORT}/set-settings`,settingsObject,{observe:'response'} )
  
}
 getDefaultSettings(): Observable<HttpResponse<Settings[]>> {
    return this.http.get<Settings[]>(`${environment.backendServerPORT}/check-settings`, { observe: 'response' });
  }
  updateDefaultSettings(newSettings): Observable<HttpResponse<Settings[]>> {
    return this.http.patch<Settings[]>(`${environment.backendServerPORT}/update-settings`,newSettings, {observe:'response'} )
    
  }
  defaultEmailSettings(emailObject: any): Observable<any>{
    return this.http.post<any>(`${environment.backendServerPORT}/settings/email/default`, emailObject, { observe:'response'})
  }
  defaultTwillioMessageSettings(messageObject: any): Observable<any>{
    return this.http.post<any>(`${environment.backendServerPORT}/settings/twillio-message/default`, messageObject, {observe:"response"})
  }

  //stripe
  // ('/settings/stripe', getStripeSettings);

// POST or PUT Route to update the Stripe settings
  updateStripeSettings(updateStripeSettings:any): Observable<any>{
  return this.http.post(`${environment.backendServerPORT}/settings/stripe/update`,updateStripeSettings, {observe:'response'} )
};

// DELETE Route to delete the Stripe settings (optional)
// router.delete('/settings/stripe', deleteStripeSettings);
}
