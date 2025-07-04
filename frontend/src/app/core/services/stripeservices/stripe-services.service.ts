import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StripeServicesService {

  constructor(private http: HttpClient) { }
createCheckoutSession(items: any[], orderId: string, userId: string) {
  return this.http.post<{ url: string }>('http://localhost:5000/api/payment/create-checkout-session', {
    items,
    orderId,
    userId
  });
}

}