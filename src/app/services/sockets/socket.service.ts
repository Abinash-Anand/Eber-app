import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { 
    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  }

  onNewRide(): Observable<any> {
    return this.socket.fromEvent('newRide');
  }

  onConfirmedRideDriver(): Observable<any> {
    return this.socket.fromEvent('rideDriverConfirmed');
  }

  onAssignDriverToRide(): Observable<any> {
    return this.socket.fromEvent('driverAssigned');
  }

  onAcceptRideRequest(): Observable<any> {
    return this.socket.fromEvent('assignedRequest');
  }

  rideStatusProgressed(): Observable<any> {
    return this.socket.fromEvent('rideStatusProgressed');
  }

  disconnect() {
    this.socket.disconnect();
  }
}
