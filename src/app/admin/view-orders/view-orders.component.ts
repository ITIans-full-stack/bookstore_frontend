import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent implements OnInit {
  orders = [
    {
      orderId: 'ORD001',
      user: 'abdallah@example.com',
      totalPrice: 720,
      status: 'Delivered',
      date: '2025-06-23'
    },
    {
      orderId: 'ORD002',
      user: 'user2@example.com',
      totalPrice: 480,
      status: 'Pending',
      date: '2025-06-22'
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}
