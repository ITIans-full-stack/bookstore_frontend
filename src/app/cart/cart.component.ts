import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../core/services/cartservices/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  private cartService = inject(CartService);
  private router = inject(Router);
  cartItems = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    // this.fetchCart();
  //  مؤقت
  localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjI4ODk5ZjdhYjg1ODdjYzVlODgzMiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUxMzk1MjY1LCJleHAiOjE3NTE0ODE2NjV9.8aF4O4GhETZodaEOkUAcDNhQ-W1WcodRHPgr_GfBVCM'); 
  this.fetchCart();

  }

  fetchCart() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cartItems.set(res.items || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
        this.errorMessage.set('Failed to load cart. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  removeItem(item: any) {
    if (confirm('Are you sure you want to remove this item?')) {
      this.isLoading.set(true);
      this.cartService.removeFromCart(item.book._id).subscribe({
        next: () => {
          this.fetchCart();
        },
        error: (err) => {
          console.error('Error removing item:', err);
          this.errorMessage.set('Failed to remove item. Please try again.');
          this.isLoading.set(false);
        },
      });
    }
  }

  increaseQty(item: any) {
    this.isLoading.set(true);
    this.cartService.addToCart(item.book._id, 1).subscribe({
      next: () => {
        this.fetchCart();
      },
      error: (err) => {
        console.error('Error increasing quantity:', err);
        this.errorMessage.set('Failed to update quantity. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  decreaseQty(item: any) {
    this.isLoading.set(true);
    if (item.quantity <= 1) {
      this.removeItem(item);
    } else {
      this.cartService.addToCart(item.book._id, -1).subscribe({
        next: () => {
          this.fetchCart();
        },
        error: (err) => {
          console.error('Error decreasing quantity:', err);
          this.errorMessage.set('Failed to update quantity. Please try again.');
          this.isLoading.set(false);
        },
      });
    }
  }

  clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
      this.isLoading.set(true);
      this.cartService.clearCart().subscribe({
        next: () => {
          this.cartItems.set([]);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error clearing cart:', err);
          this.errorMessage.set('Failed to clear cart. Please try again.');
          this.isLoading.set(false);
        },
      });
    }
  }

  getTotalPrice(): number {
    return this.cartItems().reduce(
      (total, item) => total + item.book.price * item.quantity,
      0
    );
  }

  returnToShop() {
    this.router.navigate(['/home']);
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout']);
  }
}