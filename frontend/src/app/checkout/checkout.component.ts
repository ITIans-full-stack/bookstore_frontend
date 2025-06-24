import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  fullName = '';
  email = '';
  address = '';
  paymentMethod = 'cash';

  cartItems = [
    { title: 'Angular book', price: 150, quantity: 2 },
    { title: 'book name', price: 200, quantity: 1 }
  ];

  getTotalPrice() {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  confirmOrder() {
    alert(`Thank you, ${this.fullName}! Your order is confirmed.`);
  }
}
