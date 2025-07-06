// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { PaymentResultComponent } from './payment-result.component';

// describe('PaymentResultComponent', () => {
//   let component: PaymentResultComponent;
//   let fixture: ComponentFixture<PaymentResultComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [PaymentResultComponent]
//     })
//     .compileComponents();
    
//     fixture = TestBed.createComponent(PaymentResultComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
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
      this.orderService.getOrderById(this.orderId).subscribe({
        next: (order) => {
          if (order.isPaid) {
            this.message = `✅ Payment successful! Your order (ID: ${this.orderId}) is now ${order.status}.`;
            setTimeout(() => this.router.navigate(['/home']), 3000);
          } else {
            this.orderService.updateOrderToPaid(this.orderId!, { status: 'completed' }).subscribe({
              next: () => {
                this.message = `✅ Payment confirmed! Your order (ID: ${this.orderId}) is now processing.`;
                setTimeout(() => this.router.navigate(['/home']), 3000);
              },
              error: (err) => {
                this.message = `⚠️ Failed to confirm payment: ${err.error?.message || 'Something went wrong.'}`;
              },
            });
          }
        },
        error: (err) => {
          this.message = `⚠️ Failed to fetch order: ${err.error?.message || 'Order not found.'}`;
        },
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