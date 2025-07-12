// import { Component, Input, inject } from '@angular/core';
// import { BookInterface } from '../../../core/interfaces/book-interface';
// import { CommonModule } from '@angular/common';
// import { CartService } from '../../../core/services/cartservices/cart.service';
// import { Router } from '@angular/router';
// import { RatingComponent } from '../rating/rating.component';
// import { WishlistBtnComponent } from '../wishlist-btn/wishlist-btn.component';

// @Component({
//   selector: 'app-book-card',
//   standalone: true,
//   imports: [CommonModule, RatingComponent, WishlistBtnComponent],
//   templateUrl: './book-card.component.html',
//   styleUrl: './book-card.component.css',
// })
// export class BookCardComponent {
//   @Input() book!: BookInterface;
//   isInCart: boolean = false;
//   quantity: number = 1;
//   isLoading: boolean = false;

//   constructor(private router: Router, private cartService: CartService) {}

//   ngOnInit() {
//     if (this.isUserLoggedIn()) {
//       this.loadCartStatus();
//     }
//   }

//   private isUserLoggedIn(): boolean {
//     const token = localStorage.getItem('token');
//     return !!token;
//   }

//   private loadCartStatus() {
//     this.cartService.getCart().subscribe({
//       next: (cart) => {
//         const cartItem = cart.items.find((item: any) => item.book._id === this.book._id);
//         this.isInCart = !!cartItem;
//         this.quantity = cartItem ? cartItem.quantity : 1;
//       },
//       error: (err) => {
//         console.error('Error fetching cart:', err);
//       },
//     });
//   }

//   onAddToCart() {
//     if (!this.isUserLoggedIn()) {
//       this.showToast('Please log in to add items to cart', 'danger');
     
//       return;
//     }

//     if (this.book.stock <= 0) {
//       this.showToast('Product is out of stock', 'danger');
//       return;
//     }
//     if (this.quantity > this.book.stock) {
//       this.showToast(`Only ${this.book.stock} items in stock`, 'danger');
//       return;
//     }
//     if (this.isLoading) return;

//     this.isLoading = true;
//     this.cartService.addToCart(this.book._id, this.quantity).subscribe({
//       next: (cart) => {
//         this.isInCart = true;
//         this.quantity = cart.items.find((item: any) => item.book._id === this.book._id)?.quantity || this.quantity;
//         this.showToast('Product added to cart successfully', 'success');
//         this.isLoading = false;
//       },
//       error: (err) => {
//         this.showToast(err.error?.message || 'Failed to add product to cart', 'danger');
//         this.isLoading = false;
//       },
//     });
//   }

//   onRemoveFromCart() {
//     if (!this.isUserLoggedIn()) {
//       this.showToast('Please log in to remove items from cart', 'danger');
//       return;
//     }

//     if (this.isLoading) return;

//     this.isLoading = true;
//     this.cartService.removeFromCart(this.book._id).subscribe({
//       next: () => {
//         this.isInCart = false;
//         this.quantity = 1;
//         this.showToast('Product removed from cart successfully', 'success');
//         this.isLoading = false;
//       },
//       error: (err) => {
//         this.showToast(err.error?.message || 'Failed to remove product from cart', 'danger');
//         this.isLoading = false;
//       },
//     });
//   }

//   updateQuantity(increment: number) {
//     if (!this.isUserLoggedIn()) {
//       this.showToast('Please log in to update cart', 'danger');
//       return;
//     }

//     const newQuantity = this.quantity + increment;
//     if (newQuantity < 1) return;
//     if (newQuantity > this.book.stock) {
//       this.showToast(`Only ${this.book.stock} items in stock`, 'danger');
//       return;
//     }
//     this.quantity = newQuantity;
//     if (this.isInCart) {
//       this.isLoading = true;
//       this.cartService.addToCart(this.book._id, this.quantity).subscribe({
//         next: () => {
//           this.showToast('Quantity updated successfully!', 'success');
//           this.isLoading = false;
//         },
//         error: (err) => {
//           this.showToast(err.error?.message || 'Failed to update quantity', 'danger');
//           this.isLoading = false;
//         },
//       });
//     }
//   }

//   goToDetails() {
//     this.router.navigate(['/books', this.book._id]);
//   }

//   showToast(message: string, type: 'success' | 'danger') {
//     const toastContainer = document.getElementById('toast-container');
//     if (!toastContainer) return;
    
//     const toast = document.createElement('div');
//     toast.className = `toast align-items-center text-white bg-${type} border-0 show`;
//     toast.setAttribute('role', 'alert');
//     toast.setAttribute('aria-live', 'assertive');
//     toast.setAttribute('aria-atomic', 'true');
//     toast.innerHTML = `
//       <div class="d-flex">
//         <div class="toast-body">${message}</div>
//         <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
//       </div>
//     `;
//     toastContainer.appendChild(toast);
//     setTimeout(() => toast.remove(), 3000);
//   }
// }

import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { BookInterface } from '../../../core/interfaces/book-interface';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cartservices/cart.service';
import { Router } from '@angular/router';
import { RatingComponent } from '../rating/rating.component';
import { WishlistBtnComponent } from '../wishlist-btn/wishlist-btn.component';
import { CartBtnComponent } from '../cart-btn/cart-btn.component';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RatingComponent, WishlistBtnComponent , CartBtnComponent],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css',
})
export class BookCardComponent {
  @Input() book!: BookInterface;
  @Input() showRemoveButton = false;
  @Output() remove = new EventEmitter<string>();
  isInCart: boolean = false;
  quantity: number = 1;
  isLoading: boolean = false;

  constructor(private router: Router, private cartService: CartService) { }

  ngOnInit() {
    if (this.isUserLoggedIn()) {
      this.loadCartStatus();
    }
  }

  private isUserLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  private loadCartStatus() {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        const cartItem = cart.items.find((item: any) => item.book._id === this.book._id);
        this.isInCart = !!cartItem;
        this.quantity = cartItem ? cartItem.quantity : 1;
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
      },
    });
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
    if (this.quantity > this.book.stock) {
      this.showToast(`Only ${this.book.stock} items in stock`, 'danger');
      return;
    }
    if (this.isLoading) return;

    this.isLoading = true;
    this.cartService.addToCart(this.book._id, this.quantity).subscribe({
      next: (cart) => {
        this.isInCart = true;
        this.quantity = cart.items.find((item: any) => item.book._id === this.book._id)?.quantity || this.quantity;
        this.showToast('Product added to cart successfully', 'success');
        this.isLoading = false;
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Failed to add product to cart', 'danger');
        this.isLoading = false;
      },
    });
  }

  onRemoveFromCart() {
    if (!this.isUserLoggedIn()) {
      this.showToast('Please log in to remove items from cart', 'danger');
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;
    this.cartService.removeFromCart(this.book._id).subscribe({
      next: () => {
        this.isInCart = false;
        this.quantity = 1;
        this.showToast('Product removed from cart successfully', 'success');
        this.isLoading = false;
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Failed to remove product from cart', 'danger');
        this.isLoading = false;
      },
    });
  }

  updateQuantity(increment: number) {
    if (!this.isUserLoggedIn()) {
      this.showToast('Please log in to update cart', 'danger');
      return;
    }

    const newQuantity = this.quantity + increment;
    if (newQuantity < 1) return;
    if (newQuantity > this.book.stock) {
      this.showToast(`Only ${this.book.stock} items in stock`, 'danger');
      return;
    }
    this.quantity = newQuantity;
    if (this.isInCart) {
      this.isLoading = true;
      this.cartService.addToCart(this.book._id, this.quantity).subscribe({
        next: () => {
          this.showToast('Quantity updated successfully!', 'success');
          this.isLoading = false;
        },
        error: (err) => {
          this.showToast(err.error?.message || 'Failed to update quantity', 'danger');
          this.isLoading = false;
        },
      });
    }
  }

  goToDetails() {
    this.router.navigate(['/books', this.book._id]);
  }

  showToast(message: string, type: 'success' | 'danger') {
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

  emitRemove() {
    this.remove.emit(this.book._id);
  }

}