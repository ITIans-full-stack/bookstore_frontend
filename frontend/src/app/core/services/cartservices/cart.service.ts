import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cart`;

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartItemCount = this.cartCountSubject.asObservable();

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getCart(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, { headers: this.getAuthHeaders() }).pipe(
      tap((res: any) => {
       const count = res.items?.length || 0;
        this.cartCountSubject.next(count); 
      })
    );
  }

  addToCart(bookId: string, quantity: number = 1): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/add`,
      { bookId, quantity }, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(() => this.getCart().subscribe()) 
    );
  }

  removeFromCart(bookId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${bookId}`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      tap(() => this.getCart().subscribe()) 
    );
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      tap(() => this.cartCountSubject.next(0)) 
    );
  }
}
