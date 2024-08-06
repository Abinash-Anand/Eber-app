import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../../services/sockets/socket.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class DriverRunningRequestService {

  constructor(private http: HttpClient, private socketService: SocketService) { }

  // Fetch assigned ride requests
  getAssignedRequests(): Observable<any> {
    return this.http.get(`${environment.backendServerPORT}/api/assigned-requests`); // Replace with your API endpoint
  }

  // Listen for assigned requests via socket
  onAssignedRequest(): Observable<any> {
    return this.socketService.listen('assignedRequest');
  }

  // Accept a ride request
  acceptRequest(requestId: string): Observable<any> {
    return this.http.patch(`${environment.backendServerPORT}/api/accept-request/${requestId}`, {});
  }

  // Cancel a ride request
  cancelRequest(requestId: string): Observable<any> {
    return this.http.patch(`${environment.backendServerPORT}/api/cancel-request/${requestId}`, {});
  }
}
