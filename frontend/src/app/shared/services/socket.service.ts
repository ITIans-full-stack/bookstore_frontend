// src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) {}

  onOrderCreated(): Observable<any> {
    return this.socket.fromEvent('orderCreated');
  }
  
}
