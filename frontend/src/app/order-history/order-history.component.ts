import { Component, OnInit } from '@angular/core';
import { OrderService } from '../core/services/orderService/order.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderservice: OrderService) {}

  ngOnInit() {
    this.orderservice.getMyOrders().subscribe({
      next: (res: any) => {
        this.orders = res.orders || [];
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status status-pending';
      case 'processing': return 'status status-processing';
      case 'completed': return 'status status-completed';
      case 'cancelled': return 'status status-cancelled';
      default: return 'status';
    }
  }
}
