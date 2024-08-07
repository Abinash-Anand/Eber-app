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
}
