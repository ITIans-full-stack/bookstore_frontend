import { Component, OnInit } from '@angular/core';
import { OrderService } from '../core/services/orderService/order.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit{
  orders:any[] = [];  
  filteredOrders: any[] = [];
  searchText: string = '';
  filterDuration: string = 'all';


  constructor(private orderservice: OrderService){}
 ngOnInit() {
    this.orderservice.getMyOrders().subscribe({
      next: (res: any) => {
        this.orders = res.orders || [];
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      }
    });
  }

  applyFilters() {
    const now = new Date();
    let filtered = [...this.orders];

    if (this.filterDuration === '3months') {
      const past3Months = new Date(now.setMonth(now.getMonth() - 3));
      filtered = filtered.filter(order => new Date(order.createdAt) >= past3Months);
    } else if (this.filterDuration === '6months') {
      const past6Months = new Date(now.setMonth(now.getMonth() - 6));
      filtered = filtered.filter(order => new Date(order.createdAt) >= past6Months);
    }else if (this.filterDuration === 'all') {
      filtered = [...this.orders]; 
    }
    if (this.searchText.trim()) {
      filtered = filtered.filter(order =>
        order.books.some((book: any) => book.title.toLowerCase().includes(this.searchText.toLowerCase()))
      );

    }

    this.filteredOrders = filtered;
  }
}