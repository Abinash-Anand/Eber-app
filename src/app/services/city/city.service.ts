import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { Zone } from 'zone.js/lib/zone-impl';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  allCitiesList:Zone[]  = []
  
  constructor(private http: HttpClient) { }

  postZoneData(zone): Observable<HttpResponse<any>>{
      return this.http.post<any>(`${environment.backendServerPORT}/add-zone`, zone)
  }
  //get city data
getCitiesData(): Observable<HttpResponse<any>>{
  return this.http.get<any[]>(`${environment.backendServerPORT}/get-cities`, {observe:'response'})
}
}

