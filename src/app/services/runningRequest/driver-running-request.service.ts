import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { SocketService } from '../../services/sockets/socket.service';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class DriverRunningRequestService {
  emptyBookingError: boolean = false;

  constructor(private http: HttpClient, private socketService: SocketService) { }

  getAssignedRequests(): Observable<any> {
    return this.http.get(`${environment.backendServerPORT}/api/assigned-requests`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.emptyBookingError = true;
        } else {
          this.emptyBookingError = false;
        }
        return throwError(() => new Error('No assigned requests found!'));
      })
    );
  }

  acceptRequest(requestId: string): Observable<any> {
    return this.http.patch(`${environment.backendServerPORT}/api/accept-request/${requestId}`, {});
  }

  cancelRequestFromRideBookedCollection(requestId: string): Observable<HttpResponse<any>> {
    return this.http.patch<any>(`${environment.backendServerPORT}/api/cancel-request/${requestId}`, {observe:'response'});
  }

  cancelRequestFromRidesCollection(requestId: string): Observable<any> {
    return this.http.delete(`${environment.backendServerPORT}/cancel-ride/${requestId}`);
  }

  reassignRequest(newDriver): Observable<any> {
    return this.http.post<any[]>(`${environment.backendServerPORT}/api/reassign-request/`, newDriver);
  }
}
