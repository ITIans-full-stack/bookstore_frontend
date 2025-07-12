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

  constructor(private router: Router, private authService: AuthService, private socketService: SocketService) { }

  ngOnInit() {
    this.socketService.onOrderCreated().subscribe((order) => {
      console.log('New Order Received in Admin Panel:', order);
      this.orders.unshift(order);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }



}
