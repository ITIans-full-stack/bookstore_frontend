import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/orderService/order.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-orders',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent implements OnInit {

 orders: any[] = [];

  constructor(private orderService:OrderService) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        if (Array.isArray(res)) {
          this.orders = res;
        } else {
          console.warn('Data is not an array:', res);
          this.orders = [];
        }
      },
      error: (err) => {
        console.error('Failed to fetch orders:', err);
        this.orders = [];
      }
    });
  }
}
