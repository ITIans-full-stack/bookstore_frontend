import { Component, Input, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cartservices/cart.service';
import { BookInterface } from '../../../core/interfaces/book-interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-btn.component.html',
  styleUrl: './cart-btn.component.css'
})
export class CartBtnComponent implements OnInit, OnDestroy {
  @Input() book!: BookInterface;
  @Input() showQuantityControls: boolean = true;
  @Input() buttonText: string = 'Add To Cart';
  @Input() customClass: string = '';
  
  private cartService = inject(CartService);
  private subscription: Subscription = new Subscription();
  
  isInCart: boolean = false;
  quantity: number = 0;
  isLoading: boolean = false;

  ngOnInit() {
    if (this.isUserLoggedIn()) {
      this.loadCartStatus();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private isUserLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  private loadCartStatus() {
    const cartSub = this.cartService.getCart().subscribe({
      next: (cart) => {
        const cartItem = cart.items.find((item: any) => item.book._id === this.book._id);
        this.isInCart = !!cartItem;
        this.quantity = cartItem ? cartItem.quantity : 0;
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
      }
    });
    this.subscription.add(cartSub);
  }

  onAddToCart() {
    if (!this.isUserLoggedIn()) {
      this.showToast('Please log in to add items to cart', 'danger');
      return;
    }

    if (this.book.stock <= 0) {
      this.showToast('Product is out of stock', 'danger');
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;
    const addSub = this.cartService.addToCart(this.book._id, 1).subscribe({
      next: (cart) => {
        this.isInCart = true;
        const cartItem = cart.items.find((item: any) => item.book._id === this.book._id);
        this.quantity = cartItem ? cartItem.quantity : 1;
        this.showToast('Product added to cart successfully', 'success');
        this.isLoading = false;
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Failed to add product to cart', 'danger');
        this.isLoading = false;
      }
    });
    this.subscription.add(addSub);
  }

  increaseQuantity() {
    if (!this.isUserLoggedIn()) {
      this.showToast('Please log in to update cart', 'danger');
      return;
    }

    if (this.quantity >= this.book.stock) {
      this.showToast(`Only ${this.book.stock} items in stock`, 'danger');
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;
    const increaseSub = this.cartService.addToCart(this.book._id, 1).subscribe({
      next: (cart) => {
        const cartItem = cart.items.find((item: any) => item.book._id === this.book._id);
        this.quantity = cartItem ? cartItem.quantity : this.quantity + 1;
        this.showToast('Quantity updated successfully', 'success');
        this.isLoading = false;
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Failed to update quantity', 'danger');
        this.isLoading = false;
      }
    });
    this.subscription.add(increaseSub);
  }

  decreaseQuantity() {
    if (!this.isUserLoggedIn()) {
      this.showToast('Please log in to update cart', 'danger');
      return;
    }

    if (this.quantity <= 1) {
      this.removeFromCart();
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;
    const decreaseSub = this.cartService.addToCart(this.book._id, -1).subscribe({
      next: (cart) => {
        const cartItem = cart.items.find((item: any) => item.book._id === this.book._id);
        this.quantity = cartItem ? cartItem.quantity : this.quantity - 1;
        this.showToast('Quantity updated successfully', 'success');
        this.isLoading = false;
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Failed to update quantity', 'danger');
        this.isLoading = false;
      }
    });
    this.subscription.add(decreaseSub);
  }

  removeFromCart() {
    if (!this.isUserLoggedIn()) {
      this.showToast('Please log in to remove items from cart', 'danger');
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;
    const removeSub = this.cartService.removeFromCart(this.book._id).subscribe({
      next: () => {
        this.isInCart = false;
        this.quantity = 0;
        this.showToast('Product removed from cart successfully', 'success');
        this.isLoading = false;
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Failed to remove product from cart', 'danger');
        this.isLoading = false;
      }
    });
    this.subscription.add(removeSub);
  }

  private showToast(message: string, type: 'success' | 'danger') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0 show`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}