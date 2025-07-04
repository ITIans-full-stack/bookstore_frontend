// import { Component, Input } from '@angular/core';
// import { BookInterface } from '../../core/interfaces/book-interface';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-book-card',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './book-card.component.html',
//   styleUrl: './book-card.component.css'
// })
// export class BookCardComponent {
//   @Input() book!: BookInterface;

// }

// import { Component, Input, inject } from '@angular/core';
// import { BookInterface } from '../../core/interfaces/book-interface';
// import { CommonModule } from '@angular/common';
// import { CartService } from '../../core/services/cartservices/cart.service';

// @Component({
//   selector: 'app-book-card',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './book-card.component.html',
//   styleUrl: './book-card.component.css'
// })
// export class BookCardComponent {
//   @Input() book!: BookInterface;

//   private cartService = inject(CartService);

//   onAddToCart() {
//   this.cartService.addToCart(this.book._id, 1).subscribe({
//     next: () => {
//       this.showToast('Item added to cart successfully!', 'success');
//     },
//     error: () => {
//       this.showToast('Failed to add item to cart.', 'danger');
//     },
//   });
// }

// // ✅ Helper function to show bootstrap toast
// showToast(message: string, type: 'success' | 'danger') {
//   const toastContainer = document.getElementById('toast-container');

//   const toast = document.createElement('div');
//   toast.className = `toast align-items-center text-white bg-${type} border-0 show`;
//   toast.setAttribute('role', 'alert');
//   toast.setAttribute('aria-live', 'assertive');
//   toast.setAttribute('aria-atomic', 'true');
//   toast.innerHTML = `
//     <div class="d-flex">
//       <div class="toast-body">${message}</div>
//       <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
//     </div>
//   `;

//   toastContainer?.appendChild(toast);

//   setTimeout(() => {
//     toast.remove();
//   }, 3000);
// }

// }
// #########################################


import { Component, Input, inject } from '@angular/core';
import { BookInterface } from '../../core/interfaces/book-interface';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cartservices/cart.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {
  @Input() book!: BookInterface;
  isInCart: boolean = false;
  quantity: number = 1; // Track quantity for UI
  isLoading: boolean = false; // Track loading state

  constructor(private router: Router, private cartService: CartService) {}
ngOnInit() {
  // Check if book is in cart on initialization
  this.cartService.getCart().subscribe({
    next: (cart) => {
      const cartItem = cart.items.find((item: any) => item.book._id === this.book._id);
      this.isInCart = !!cartItem;
      this.quantity = cartItem ? cartItem.quantity : 1;
    },
    error: (err) => {
      console.error('Error fetching cart:', err);
      this.showToast('Failed to load cart', 'danger');
    }
  });
}

onAddToCart() {
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
    }
  });
}

onRemoveFromCart() {
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
      this.showToast('Failed to remove product from cart', 'danger');
      this.isLoading = false;
    }
  });
}

updateQuantity(increment: number) {
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
      }
    });
  }
}

goToDetails() {
  this.router.navigate(['/books', this.book._id]);
}

showToast(message: string, type: 'success' | 'danger') {
  const toastContainer = document.getElementById('toast-container');
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
  toastContainer?.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
}