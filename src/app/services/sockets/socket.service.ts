import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) {
    this.setupSocketConnection();
  }

  setupSocketConnection() {
    this.socket.on('connect', () => {
      console.log('Connected to the server');
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`Disconnected: ${reason}`);
      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error(`Connection Error: ${error}`);
    });
  }

  listen(eventName: string): Observable<any> {
    return this.socket.fromEvent(eventName);
  }

  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  disconnect() {
    this.socket.disconnect();
  }

  onNewRide(): Observable<any> {
    return this.listen('newRide');
  }

  onAssignDriverToRide(): Observable<any> {
    return this.listen('driverAssigned');
  }

  onAssignedRequest(): Observable<any> {
    return this.listen('assignedRequest');
  }
}
