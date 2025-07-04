import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../core/services/orderService/order.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  private orderService = inject(OrderService);
  private http = inject(HttpClient);
  private router = inject(Router);

  orderId: string | null = null;
  total: number = 0;
  errorMessage: string | null = null;
  showSuccessToast = false;
  showErrorToast = false;

  constructor() {
    this.orderId = history.state.orderId || null;
    this.total = history.state.total || 0;
    this.loadPaypalScript();
  }

  loadPaypalScript() {
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AaHqaL_vPFFmnzg8s1QaOlLM1lc52raWwLeD9IbHlK7mExAkfyOIv_qIVHuXjifdm8nIPoLrAHB1seNi&currency=USD';
    script.onload = () => this.renderPaypalButton();
    document.body.appendChild(script);
  }

  renderPaypalButton() {
    if (!this.orderId || !this.total) {
      this.errorMessage = 'No order or total amount selected';
      return;
    }

    (window as any).paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return this.http
          .post('http://localhost:5000/api/payment/create-order', { total: this.total })
          .toPromise()
          .then((response: any) => response.id);
      },
      onApprove: (data: any, actions: any) => {
        return this.http
          .post(`http://localhost:5000/api/payment/capture-order/${data.orderID}`, {})
          .toPromise()
          .then(() => {
            this.orderService.payOrder(this.orderId!).subscribe({
              next: () => {
                this.showSuccessToast = true;
                setTimeout(() => {
                  this.showSuccessToast = false;
                  this.router.navigate(['/orders']);
                }, 3000);
              },
              error: (err) => {
                this.errorMessage = 'Payment confirmation failed: ' + err.error.message;
                this.showErrorToast = true;
              },
            });
          });
      },
      onError: (err: any) => {
        this.errorMessage = 'PayPal payment failed';
        this.showErrorToast = true;
      },
    }).render('#paypal-button-container');
  }

  cancelOrder() {
    if (!this.orderId) {
      this.errorMessage = 'No order selected';
      return;
    }
    this.orderService.cancelOrder(this.orderId).subscribe({
      next: () => {
        this.showSuccessToast = true;
        setTimeout(() => {
          this.showSuccessToast = false;
          this.router.navigate(['/cart']);
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = 'Failed to cancel order: ' + err.error.message;
        this.showErrorToast = true;
      },
    });
  }

  returnToCart() {
    this.router.navigate(['/cart']);
  }
}




// //  stripe
// import { Component } from '@angular/core';
// import { loadStripe } from '@stripe/stripe-js';
// import { StripeServicesService } from '../core/services/stripeservices/stripe-services.service';
// import { CartService } from '../core/services/cartservices/cart.service';
// @Component({
//   selector: 'app-checkout',
//   standalone: true,
//   template: './checkout.component.html',

// })
// export class CheckoutComponent {
//   cartItems = [];
//   constructor(private cartService: CartService , private paymentService: StripeServicesService) {}

// ngOnInit() {
//   this.cartItems= this.cartService.getCart();
// }

// async checkout() {
//   const stripe = await loadStripe('pk_test_xxxxxxx');

//   this.paymentService.createCheckoutSession(this.cartItems).subscribe(res => {
//     if (res.url) window.location.href = res.url;
//   });
// }
// }

