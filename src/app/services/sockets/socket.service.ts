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

  // Setup the socket connection with appropriate error handling and reconnection logic
  setupSocketConnection() {
    this.socket.on('connect', () => {
      console.log('Connected to the server');
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`Disconnected: ${reason}`);
      if (reason === 'io server disconnect') {
        // The disconnection was initiated by the server, reconnect manually
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error(`Connection Error: ${error}`);
    });
  }

  // Generic method to listen to any event
  listen(eventName: string): Observable<any> {
    return this.socket.fromEvent(eventName);
  }

  // Emit an event with data
  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  // Disconnect the socket
  disconnect() {
    this.socket.disconnect();
  }

  // Specific event listeners
  onNewRide(): Observable<any> {
    return this.listen('newRide');
  }

  onAssignDriverToRide(): Observable<any> {
    return this.listen('driverAssigned');
  }
}
