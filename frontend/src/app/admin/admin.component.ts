import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from '../core/services/services/auth.service';
import { SocketService } from '../core/services/services/socket.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../core/services/services/notification.service';

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
  showAllNotifications = false;

  constructor(private router: Router,
    private authService: AuthService,
    private socketService: SocketService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.socketService.onOrderCreated().subscribe((order) => {
      console.log('New Order Received in Admin Panel:', order);
      this.orders.unshift(order);
      this.notifications.push(order);
      setTimeout(() => {
        this.removeNotification(order.orderId);
      }, 5000);
    });
    this.notificationService.showNotifications$.subscribe((show) => {
      this.showAllNotifications = show;
    });
  }

  removeNotification(orderId: string) {
    this.notifications = this.notifications.filter(o => o.orderId !== orderId);
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  toggleNotificationPanel() {
    this.showAllNotifications = !this.showAllNotifications;
  }



}
