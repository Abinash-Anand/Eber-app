import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

 constructor(private http: HttpClient) { }

  getRideHistory(): Observable<any> {
    return this.http.get('/api/ride-history');
  }

  exportRideHistoryToCSV(filters: any): Observable<Blob> {
    return this.http.post('/api/ride-history/export', filters, { responseType: 'blob' });
  }
}
