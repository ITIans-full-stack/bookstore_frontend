
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { OrderService } from '../core/services/orderService/order.service';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-payment-result',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './payment-result.component.html',
//   styleUrls: ['./payment-result.component.css'],
// })
// export class PaymentResultComponent implements OnInit {
//   status: string | null = null;
//   orderId: string | null = null;
//   message = '';
//   isLoading = false;

//   constructor(
//     private route: ActivatedRoute,
//     private orderService: OrderService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.status = this.route.snapshot.queryParamMap.get('status');
//     this.orderId = this.route.snapshot.queryParamMap.get('orderId');

//     if (this.status === 'success' && this.orderId) {
//       this.handleSuccessfulPayment();
//     } else if (this.status === 'cancel') {
//       this.message = '❌ Payment was cancelled. Please try again.';
//     } else {
//       this.message = '🚫 Unknown payment status.';
//     }
//   }

//   private handleSuccessfulPayment(): void {
//     this.isLoading = true;
    
//     this.orderService.getOrderById(this.orderId!).subscribe({
//       next: (order) => {
//         if (order.isPaid) {
//           this.message = `✅ Payment successful! Your order (ID: ${this.orderId}) is ${order.status}.`;
//           this.isLoading = false;
//           setTimeout(() => this.router.navigate(['/home']), 3000);
//         } else {
//           this.confirmPayment();
//         }
//       },
//       error: (err) => {
//         console.error('Error fetching order:', err);
//         this.confirmPayment();
//       }
//     });
//   }

//   private confirmPayment(): void {
//     this.orderService.payOrder(this.orderId!).subscribe({
//       next: (response) => {
//         this.message = `✅ Payment confirmed! Your order (ID: ${this.orderId}) is now processing.`;
//         this.isLoading = false;
//         setTimeout(() => this.router.navigate(['/home']), 3000);
//       },
//       error: (err) => {
//         console.error('Error confirming payment:', err);
//         this.message = `⚠️ Payment processed but confirmation failed. Please contact support with Order ID: ${this.orderId}`;
//         this.isLoading = false;
//       }
//     });
//   }

//   goHome(): void {
//     this.router.navigate(['/home']);
//   }
// }
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../core/services/orderService/order.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.css'],
})
export class PaymentResultComponent implements OnInit {
  status: string | null = null;
  orderId: string | null = null;
  message = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.status = this.route.snapshot.queryParamMap.get('status');
    this.orderId = this.route.snapshot.queryParamMap.get('orderId');

    if (this.status === 'success' && this.orderId) {
      this.handleSuccessfulPayment();
    } else if (this.status === 'cancel') {
      this.message = '❌ Payment was cancelled. Please try again.';
    } else {
      this.message = '🚫 Unknown payment status.';
    }
  }

  private handleSuccessfulPayment(): void {
    this.isLoading = true;
    
    this.orderService.getOrderById(this.orderId!).subscribe({
      next: (order) => {
        if (order.isPaid) {
          this.message = `✅ Payment successful! Your order (ID: ${this.orderId}) is ${order.status}.`;
          this.isLoading = false;
          setTimeout(() => this.router.navigate(['/home']), 3000);
        } else {
          this.confirmPayment();
        }
      },
      error: (err) => {
        console.error('Error fetching order:', err);
        this.confirmPayment();
      }
    });
  }

  private confirmPayment(): void {
    this.orderService.payOrder(this.orderId!).subscribe({
      next: (response) => {
        this.message = `✅ Payment confirmed! Your order (ID: ${this.orderId}) is ${response.order.status}.`; // Updated to use response.order.status
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/home']), 3000);
      },
      error: (err) => {
        console.error('Error confirming payment:', err);
        this.message = `⚠️ Payment processed but confirmation failed. Please contact support with Order ID: ${this.orderId}`;
        this.isLoading = false;
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}