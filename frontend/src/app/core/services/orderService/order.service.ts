// import { Injectable } from '@angular/core';
// import { HttpClient , HttpHeaders} from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class OrderService {
//   private apiUrl = 'http://localhost:5000/api/orders';
//   constructor(private http: HttpClient) {}
// private getAuthHeaders(): HttpHeaders {
//     const token = localStorage.getItem('token');
//     return new HttpHeaders().set('Authorization', `Bearer ${token}`);
//   }
//   createOrderFromCart(): Observable<any> {
//     return this.http.post(`${this.apiUrl}/from-cart`, {}, { headers: this.getAuthHeaders() });
//   }

//   getMyOrders(): Observable<any> {
//     return this.http.get(`${this.apiUrl}/my-orders`, { headers: this.getAuthHeaders() });
//   }

//   payOrder(orderId: string): Observable<any> {
//     return this.http.put(`${this.apiUrl}/pay/${orderId}`, {}, { headers: this.getAuthHeaders() });
//   }
//   cancelOrder(orderId: string): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/${orderId}`, { headers: this.getAuthHeaders() });
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/orders';
  private ordersSubject = new BehaviorSubject<any[]>([]); // Store orders for reuse
  orders$ = this.ordersSubject.asObservable(); // Observable for other components

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  createOrderFromCart(): Observable<any> {
    return this.http.post(`${this.apiUrl}/from-cart`, {}, { headers: this.getAuthHeaders() });
  }

  getMyOrders(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-orders?page=${page}&limit=${limit}`, { headers: this.getAuthHeaders() });
  }

  // Store orders for reuse in other components
  storeOrders(orders: any[]): void {
    this.ordersSubject.next(orders);
  }

  payOrder(orderId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/pay/${orderId}`, {}, { headers: this.getAuthHeaders() });
  }

  cancelOrder(orderId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${orderId}`, { headers: this.getAuthHeaders() });
  }
}