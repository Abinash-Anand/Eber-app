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
  return this.http.get<any[]>(`${environment.backendServerPORT}/get-countriesList`, {observe:'response'})
  }
  
    getCitiesByCountry(countryId: string): Observable<any> {
    return this.http.get(`${environment.backendServerPORT}/cities/by-country/${countryId}`);
    }
  updateZoneData(zoneData): Observable<HttpResponse<any>>{
    return this.http.patch<any>(`${environment.backendServerPORT}/city/update/zone`,zoneData, {observe:'response'})
  }
getSpecificZoneData(fromAddress: string): Observable<any> {
    // Pass the fromAddress as a query parameter
    return this.http.get<any>(`${environment.backendServerPORT}/cities/specific-zone`, { 
        params: { cityName: fromAddress } 
    });
}

}

