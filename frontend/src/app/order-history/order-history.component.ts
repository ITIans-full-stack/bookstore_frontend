import { Component, OnInit } from '@angular/core';
import { OrderService } from '../core/services/orderService/order.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSpinnerModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  loading = false;

  constructor(private orderservice: OrderService, private toastr: ToastrService, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders(loadMore: boolean = false) {
    // this.loading = true;
    this.spinner.show();
    this.orderservice.getMyOrders(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (loadMore) {
          this.orders = [...this.orders, ...res.orders]; // Append
        } else {
          this.orders = res.orders || [];
        }
        this.totalPages = res.totalPages;
        // this.loading = false;
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.toastr.error('Failed to load orders');
        // this.loading = false;
        this.spinner.hide();
      }
    });
  }

  loadMoreOrders() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadOrders(true);
    }
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
            this.currentPage = 1; // Reset page and reload
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

