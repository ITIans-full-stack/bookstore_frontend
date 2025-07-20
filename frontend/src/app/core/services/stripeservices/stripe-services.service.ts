import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StripeServicesService {
  private apiUrl = `${environment.apiUrl}/payment`;

  constructor(private http: HttpClient) {}

  createCheckoutSession(items: any[], orderId: string, userId: string): Observable<{ url: string }> {
    console.log('Initiating checkout session for:', { orderId, userId });
    return this.http.post<{ url: string }>(`${this.apiUrl}/create-checkout-session`, {
      items,
      orderId,
      userId,
    });
  }
}