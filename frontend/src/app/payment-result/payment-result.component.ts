import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../core/services/orderService/order.service';
import { CommonModule, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [CommonModule, RouterModule, NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.css'],
})
export class PaymentResultComponent implements OnInit {
  status: string | null = null;
  orderId: string | null = null;
  message = '';
  
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.status = this.route.snapshot.queryParamMap.get('status');
    this.orderId = this.route.snapshot.queryParamMap.get('orderId');

    if (this.status === 'success' && this.orderId) {
      this.orderService.payOrder(this.orderId).subscribe({
        next: () => {
     this.message = '✅ Payment successful! Thank you for your order ';
          setTimeout(() => this.router.navigate(['/home']), 3000);
        },
        error: () => {
          this.message = '⚠️ Something went wrong while confirming your payment.';
        }
      });
    } else if (this.status === 'cancel') {
      this.message = '❌ Payment was cancelled. Please try again.';
    } else {
      this.message = '🚫 Unknown payment status.';
    }
  }


  goHome(): void {
    this.router.navigate(['/home']);
  }

}
