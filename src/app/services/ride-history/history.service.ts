import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private http: HttpClient) { }

  getRideHistory(): Observable<any> {
    return this.http.get(`${environment.backendServerPORT}/rides/ride-history`, { observe: 'response' });
  }

  exportRideHistoryToCSV(filters: any): Observable<Blob> {
    return this.http.post(`${environment.backendServerPORT}/api/ride-history/export`, filters, { responseType: 'blob' });
  }
  getFilteredRide(filter: string): Observable<any>{
    return this.http.get<any>(`${environment.backendServerPORT}/history/filter-type/${filter}`, {observe:'response'})
  }
  getHistoryBySearch(searchString: string): Observable<any>{
    return this.http.get<any[]>(`${environment.backendServerPORT}/history/search-history/${searchString}`,{observe:'response'} )
  }
}
