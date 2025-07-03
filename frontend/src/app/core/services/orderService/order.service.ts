// // 
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class OrderService {
//   constructor(private http: HttpClient) {}

//   createOrderFromCart(): Observable<any> {
//     return this.http.post('/api/orders/from-cart', {}); // المسار حسب API عندك
//   }

//   getMyOrders(): Observable<any> {
//     return this.http.get('/api/orders/my-orders');
//   }

//   payOrder(orderId: string): Observable<any> {
//     return this.http.put(`/api/orders/pay/${orderId}`, {});
//   }
// }
// #########################

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = '/api/orders';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return token
      ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) }
      : {};
  }

  createOrderFromCart(): Observable<any> {
    return this.http.post(`${this.apiUrl}/from-cart`, {}, this.getHeaders());
  }

  getMyOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-orders`, this.getHeaders());
  }

  payOrder(orderId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/pay/${orderId}`, {}, this.getHeaders());
  }
}
