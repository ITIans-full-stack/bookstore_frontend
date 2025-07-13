import { Component, OnInit } from '@angular/core';
import { OrderService } from '../core/services/orderService/order.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderservice: OrderService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadOrders();
  };

  loadOrders() {
    this.orderservice.getMyOrders().subscribe({
      next: (res: any) => {
        this.orders = res.orders || [];
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      }
    });
  };
  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status status-pending';
      case 'processing': return 'status status-processing';
      case 'completed': return 'status status-completed';
      case 'cancelled': return 'status status-cancelled';
      default: return 'status';
    }
  };

  cancelOrder(orderId: string) {
  Swal.fire({
    title: 'Cancel Order?',
    text: 'Are you sure you want to cancel this order?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, cancel it!',
    cancelButtonText: 'No, keep it',
  }).then((result) => {
  if (result.isConfirmed) {
    this.orderservice.cancelOrder(orderId).subscribe({
      next: () => {
        this.toastr.success('Order cancelled successfully');
        this.loadOrders(); 
      },
      error: (err) => {
        console.error('Cancel order error:', err);
        this.toastr.error(err.error.message || 'Failed to cancel order');
      }
    });
  }
  });
}

}
