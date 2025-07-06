// import { Component, inject, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { Router, RouterModule } from '@angular/router';
// import { CartService } from '../core/services/cartservices/cart.service';
// import { OrderService } from '../core/services/orderService/order.service';
// import { StripeService} from 'ngx-stripe';
// import { StripeServicesService } from '../core/services/stripeservices/stripe-services.service';
//  import { loadStripe } from '@stripe/stripe-js';

// @Component({
//   selector: 'app-cart',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule, RouterModule],
//   templateUrl: './cart.component.html',
//   styleUrl: './cart.component.css',
// })
// export class CartComponent {
//   private stripeService = inject(StripeServicesService);

//   private cartService = inject(CartService);
//   private orderService = inject(OrderService);
//   private router = inject(Router);

//   cartItems = signal<any[]>([]);
//   isLoading = signal<boolean>(false);
//   errorMessage = signal<string | null>(null);

//   // Toast flags
//   showSuccessToast = signal(false);
//   showErrorToast = signal(false);
//   showConfirmRemoveToast = signal(false);
//   showConfirmClearCartToast = signal(false);

//   // Temp item to remove
//   itemToRemove: any = null;

//   constructor() {
//     this.fetchCart();
//   }

//   private autoCloseToast(toastSignal: any) {
//     setTimeout(() => {
//       toastSignal.set(false);
//     }, 3000); 
//   }

//   fetchCart() {
//     this.isLoading.set(true);
//     this.errorMessage.set(null);
//     this.cartService.getCart().subscribe({
//       next: (res) => {
//         this.cartItems.set(res.items || []);
//         this.isLoading.set(false);
//       },
//       error: (err) => {
//         console.error('Error fetching cart:', err);
//         this.errorMessage.set('Failed to load cart. Please try again.');
//         this.showErrorToast.set(true);
//         this.autoCloseToast(this.showErrorToast);
//         this.isLoading.set(false);
//       },
//     });
//   }

//   promptRemoveItem(item: any) {
//     this.itemToRemove = item;
//     this.showConfirmRemoveToast.set(true);
//   }

//   confirmRemoveItem() {
//     if (!this.itemToRemove) return;
//     this.isLoading.set(true);
//     this.cartService.removeFromCart(this.itemToRemove.book._id).subscribe({
//       next: () => {
//         this.fetchCart();
//         this.showSuccessToast.set(true);
//         this.autoCloseToast(this.showSuccessToast);
//         this.showConfirmRemoveToast.set(false);
//         this.itemToRemove = null;
//       },
//       error: (err) => {
//         console.error('Error removing item:', err);
//         this.errorMessage.set('Failed to remove item. Please try again.');
//         this.showErrorToast.set(true);
//         this.autoCloseToast(this.showErrorToast);
//         this.isLoading.set(false);
//       },
//     });
//   }

//   cancelRemoveItem() {
//     this.itemToRemove = null;
//     this.showConfirmRemoveToast.set(false);
//   }

//   increaseQty(item: any) {
//     if (item.quantity >= item.book.stock) {
//       this.errorMessage.set('Cannot add more items. Stock limit reached.');
//       this.showErrorToast.set(true);
//       this.autoCloseToast(this.showErrorToast);
//       return;
//     }
//     this.isLoading.set(true);
//     this.cartService.addToCart(item.book._id, 1).subscribe({
//       next: () => {
//         this.fetchCart();
//         this.isLoading.set(false);
//       },
//       error: (err) => {
//         console.error('Error increasing quantity:', err);
//         this.errorMessage.set('Failed to update quantity. Please try again.');
//         this.showErrorToast.set(true);
//         this.autoCloseToast(this.showErrorToast);
//         this.isLoading.set(false);
//       },
//     });
//   }

//   decreaseQty(item: any) {
//     if (item.quantity <= 1) {
//       this.promptRemoveItem(item);
//     } else {
//       this.isLoading.set(true);
//       this.cartService.addToCart(item.book._id, -1).subscribe({
//         next: () => {
//           this.fetchCart();
//           this.isLoading.set(false);
//         },
//         error: (err) => {
//           console.error('Error decreasing quantity:', err);
//           this.errorMessage.set('Failed to update quantity. Please try again.');
//           this.showErrorToast.set(true);
//           this.autoCloseToast(this.showErrorToast);
//           this.isLoading.set(false);
//         },
//       });
//     }
//   }

//   promptClearCart() {
//     this.showConfirmClearCartToast.set(true);
//   }

//   confirmClearCart() {
//     this.isLoading.set(true);
//     this.cartService.clearCart().subscribe({
//       next: () => {
//         this.cartItems.set([]);
//         this.showSuccessToast.set(true);
//         this.autoCloseToast(this.showSuccessToast);
//         this.showConfirmClearCartToast.set(false);
//         this.isLoading.set(false);
//       },
//       error: (err) => {
//         console.error('Error clearing cart:', err);
//         this.errorMessage.set('Failed to clear cart. Please try again.');
//         this.showErrorToast.set(true);
//         this.autoCloseToast(this.showErrorToast);
//         this.isLoading.set(false);
//       },
//     });
//   }

//   cancelClearCart() {
//     this.showConfirmClearCartToast.set(false);
//   }

//   getTotalPrice(): number {
//     return this.cartItems().reduce(
//       (total, item) => total + item.book.price * item.quantity,
//       0
//     );
//   }

//   returnToShop() {
//     this.router.navigate(['/home']);
//   }

// async checkout() {
//   if (this.cartItems().length === 0) {
//     this.errorMessage.set('The cart is empty, please add books to complete the payment');
//     this.showErrorToast.set(true);
//     this.autoCloseToast(this.showErrorToast);
//     return;
//   }

//   this.isLoading.set(true);

//   const items = this.cartItems().map((item) => ({
//     name: item.book.title,
//     price: item.book.price,
//     quantity: item.quantity
//   }));


//   this.orderService.createOrderFromCart().subscribe({
//     next: async (response) => {
//       const orderId = response.order._id;
//       const userId = response.order.user;

//       try {
//         const stripe = await loadStripe('pk_test_51RRAPZPh6I2dCw4UwbapbzAKwyPBa9UqzjMfGssEjKsvfZEx9emvjiuGY5FP0tN4wG2yG25xs16aK2fhaSkKJ8sg00cKkQz1wk'); 

//         this.stripeService.createCheckoutSession(items, orderId, userId).subscribe({
//           next: (res) => {
//             window.location.href = res.url;
//           },
//           error: (err) => {
//             console.error('Stripe session creation failed:', err);
//             this.errorMessage.set('Failed to create payment session');
//             this.showErrorToast.set(true);
//             this.autoCloseToast(this.showErrorToast);
//             this.isLoading.set(false);
//           },
//         });
//       } catch (err) {
//         console.error('Stripe load error:', err);
//         this.errorMessage.set('Failed to load Stripe');
//         this.showErrorToast.set(true);
//         this.autoCloseToast(this.showErrorToast);
//         this.isLoading.set(false);
//       }
//     },

//     error: (err) => {
//       console.error('Order creation error:', err);
//       this.errorMessage.set('Failed to create request');
//       this.showErrorToast.set(true);
//       this.autoCloseToast(this.showErrorToast);
//       this.isLoading.set(false);
//     },
//   });
// }


//  }


import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../core/services/cartservices/cart.service';
import { OrderService } from '../core/services/orderService/order.service';
import { StripeServicesService } from '../core/services/stripeservices/stripe-services.service';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  private stripeService = inject(StripeServicesService);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  cartItems = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Toast flags
  showSuccessToast = signal(false);
  showErrorToast = signal(false);
  showConfirmRemoveToast = signal(false);
  showConfirmClearCartToast = signal(false);

  // Temp item to remove
  itemToRemove: any = null;

  constructor() {
    this.fetchCart();
  }

  private autoCloseToast(toastSignal: any) {
    setTimeout(() => {
      toastSignal.set(false);
    }, 3000);
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
        this.errorMessage.set(err.error?.message || 'Failed to load cart. Please try again.');
        this.showErrorToast.set(true);
        this.autoCloseToast(this.showErrorToast);
        this.isLoading.set(false);
      },
    });
  }

  promptRemoveItem(item: any) {
    this.itemToRemove = item;
    this.showConfirmRemoveToast.set(true);
  }

  confirmRemoveItem() {
    if (!this.itemToRemove) return;
    this.isLoading.set(true);
    this.cartService.removeFromCart(this.itemToRemove.book._id).subscribe({
      next: () => {
        this.fetchCart();
        this.showSuccessToast.set(true);
        this.autoCloseToast(this.showSuccessToast);
        this.showConfirmRemoveToast.set(false);
        this.itemToRemove = null;
      },
      error: (err) => {
        console.error('Error removing item:', err);
        this.errorMessage.set(err.error?.message || 'Failed to remove item. Please try again.');
        this.showErrorToast.set(true);
        this.autoCloseToast(this.showErrorToast);
        this.isLoading.set(false);
      },
    });
  }

  cancelRemoveItem() {
    this.itemToRemove = null;
    this.showConfirmRemoveToast.set(false);
  }

  increaseQty(item: any) {
    if (item.quantity >= item.book.stock) {
      this.errorMessage.set('Cannot add more items. Stock limit reached.');
      this.showErrorToast.set(true);
      this.autoCloseToast(this.showErrorToast);
      return;
    }
    this.isLoading.set(true);
    this.cartService.addToCart(item.book._id, 1).subscribe({
      next: () => {
        this.fetchCart();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error increasing quantity:', err);
        this.errorMessage.set(err.error?.message || 'Failed to update quantity. Please try again.');
        this.showErrorToast.set(true);
        this.autoCloseToast(this.showErrorToast);
        this.isLoading.set(false);
      },
    });
  }

  decreaseQty(item: any) {
    if (item.quantity <= 1) {
      this.promptRemoveItem(item);
    } else {
      this.isLoading.set(true);
      this.cartService.addToCart(item.book._id, -1).subscribe({
        next: () => {
          this.fetchCart();
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error decreasing quantity:', err);
          this.errorMessage.set(err.error?.message || 'Failed to update quantity. Please try again.');
          this.showErrorToast.set(true);
          this.autoCloseToast(this.showErrorToast);
          this.isLoading.set(false);
        },
      });
    }
  }

  promptClearCart() {
    this.showConfirmClearCartToast.set(true);
  }

  confirmClearCart() {
    this.isLoading.set(true);
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cartItems.set([]);
        this.showSuccessToast.set(true);
        this.autoCloseToast(this.showSuccessToast);
        this.showConfirmClearCartToast.set(false);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error clearing cart:', err);
        this.errorMessage.set(err.error?.message || 'Failed to clear cart. Please try again.');
        this.showErrorToast.set(true);
        this.autoCloseToast(this.showErrorToast);
        this.isLoading.set(false);
      },
    });
  }

  cancelClearCart() {
    this.showConfirmClearCartToast.set(false);
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

  async checkout() {
    if (this.cartItems().length === 0) {
      this.errorMessage.set('The cart is empty, please add books to complete the payment');
      this.showErrorToast.set(true);
      this.autoCloseToast(this.showErrorToast);
      return;
    }

    this.isLoading.set(true);

    const items = this.cartItems().map((item) => ({
      name: item.book.title,
      price: item.book.price,
      quantity: item.quantity,
    }));

    this.orderService.createOrderFromCart().subscribe({
      next: async (response) => {
        const orderId = response.order._id;
        const userId = response.order.user;

        try {
          const stripe = await loadStripe('pk_test_51RRAPZPh6I2dCw4UwbapbzAKwyPBa9UqzjMfGssEjKsvfZEx9emvjiuGY5FP0tN4wG2yG25xs16aK2fhaSkKJ8sg00cKkQz1wk');

          this.stripeService.createCheckoutSession(items, orderId, userId).subscribe({
            next: (res) => {
              window.location.href = res.url;
              this.isLoading.set(false);
            },
            error: (err) => {
              console.error('Stripe session creation failed:', err);
              this.errorMessage.set(err.error?.message || 'Failed to create payment session');
              this.showErrorToast.set(true);
              this.autoCloseToast(this.showErrorToast);
              this.isLoading.set(false);
            },
          });
        } catch (err) {
          console.error('Stripe load error:', err);
          this.errorMessage.set('Failed to load Stripe');
          this.showErrorToast.set(true);
          this.autoCloseToast(this.showErrorToast);
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        console.error('Order creation error:', err);
        this.errorMessage.set(err.error?.message || 'Failed to create order');
        this.showErrorToast.set(true);
        this.autoCloseToast(this.showErrorToast);
        this.isLoading.set(false);
      },
    });
  }
}