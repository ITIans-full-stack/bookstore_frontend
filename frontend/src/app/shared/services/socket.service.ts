import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  // constructor(private socket: Socket) {}
  constructor(private socket: Socket) {
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.ioSocket.id);
    });

    this.socket.on('connect_error', (err:any) => {
      console.error('❌ Socket connection error:', err);
    });
  }

  onOrderCreated(): Observable<any> {
    return this.socket.fromEvent('orderCreated');
  }

}