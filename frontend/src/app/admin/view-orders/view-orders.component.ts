// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { OrderService } from '../../core/services/orderService/order.service';
// import { ReactiveFormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-view-orders',
//   standalone: true,
//   imports: [CommonModule,ReactiveFormsModule],
//   templateUrl: './view-orders.component.html',
//   styleUrls: ['./view-orders.component.css']
// })
// export class ViewOrdersComponent implements OnInit {

//  orders: any[] = [];

//   constructor(private orderService:OrderService) {}

//   ngOnInit(): void {
//     this.orderService.getAllOrders().subscribe({
//       next: (res) => {
//         if (Array.isArray(res)) {
//           this.orders = res;
//         } else {
//           console.warn('Data is not an array:', res);
//           this.orders = [];
//         }
//       },
//       error: (err) => {
//         console.error('Failed to fetch orders:', err);
//         this.orders = [];
//       }
//     });
//   }
// }




import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/orderService/order.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-orders',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css'],
})
export class ViewOrdersComponent implements OnInit {
  orders: any[] = [];
  page: number = 1;
  limit: number = 10;
  totalPages: number = 0;
  totalOrders: number = 0;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders(this.page, this.limit).subscribe({
      next: (res: any) => {
        this.orders = res.orders || [];
        this.page = res.page || 1;
        this.totalPages = res.totalPages || 0;
        this.totalOrders = res.totalOrders || 0;
      },
      error: (err) => {
        console.error('Failed to fetch orders:', err);
        this.orders = [];
      },
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadOrders();
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadOrders();
    }
  }
}