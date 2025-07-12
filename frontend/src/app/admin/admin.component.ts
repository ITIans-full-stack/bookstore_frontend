import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from '../shared/services/auth.service';
import { SocketService } from '../shared/services/socket.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  orders: any[] = [];
  notifications: any[] = [];

  constructor(private router: Router, private authService: AuthService, private socketService: SocketService) { }

  ngOnInit() {
    this.socketService.onOrderCreated().subscribe((order) => {
      console.log('New Order Received in Admin Panel:', order);
      this.orders.unshift(order);
      this.notifications.push(order);
      setTimeout(() => {
        this.removeNotification(order.orderId);
      }, 5000);
    });
  }

  removeNotification(orderId: string) {
    this.notifications = this.notifications.filter(o => o.orderId !== orderId);
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }



}
