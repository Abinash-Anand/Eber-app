import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pricing } from '../../shared/pricing';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class VehiclePricingService {
  
  constructor(private http: HttpClient){}
  postPricingData(pricingObject): Observable<HttpResponse<Pricing[]>> {
    return this.http.post<Pricing[]>(`${environment.backendServerPORT}/submit-pricing`, pricingObject, {observe:'response'} )
  }

   getPricingData(): Observable<HttpResponse<Pricing[]>> {
    return this.http.get<Pricing[]>(`${environment.backendServerPORT}/get-pricing-data`, {observe:'response'} )
   }
    fetchAllPricingData(): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(`${environment.backendServerPORT}/fetch/pricing-data`, {observe:'response'} )
    }
 
}
