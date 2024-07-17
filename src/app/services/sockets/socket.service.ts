import { Injectable } from '@angular/core';
// import * as io from 'socket.io-client';
import { environment } from '../../../environment';
import { io } from 'socket.io-client';
// import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;

  constructor() {
    this.socket = io(environment.backendServerPORT);
  }

  on(eventName: string, callback: (data: any) => void) {
    this.socket.on(eventName, callback);
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}
