// import { Injectable ,inject} from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {

//   constructor() { }

  
//   private http = inject(HttpClient);
//   private apiUrl = 'http://localhost:5000/api/cart';

//   private getAuthHeaders(): HttpHeaders {
//     const token = localStorage.getItem('token');
//     return new HttpHeaders().set('Authorization', `Bearer ${token}`);
//   }

//   getCart(): Observable<any> {
//     return this.http.get(`${this.apiUrl}`, { headers: this.getAuthHeaders() });
//   }

//   addToCart(bookId: string, quantity: number = 1): Observable<any> {
//     return this.http.post(
//       `${this.apiUrl}/add`,
//       { bookId, quantity },
//       { headers: this.getAuthHeaders() }
//     );
//   }

//   removeFromCart(bookId: string): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/remove/${bookId}`, {
//       headers: this.getAuthHeaders(),
//     });
//   }

//   clearCart(): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/clear`, {
//       headers: this.getAuthHeaders(),
//     });
//   }
// }


// مؤقت
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/cart';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return token
      ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) }
      : {}; // بدون headers لو مفيش توكن
  }

  getCart(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, this.getHeaders());
  }

  addToCart(bookId: string, quantity: number = 1): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/add`,
      { bookId, quantity },
      this.getHeaders()
    );
  }

  removeFromCart(bookId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${bookId}`, this.getHeaders());
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`, this.getHeaders());
  }
}
