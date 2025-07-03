// import { Component, inject, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { Router, RouterModule } from '@angular/router';
// import { CartService } from '../core/services/cartservices/cart.service';
// import { OrderService } from '../core/services/orderService/order.service';
// @Component({
//   selector: 'app-cart',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule, RouterModule],
//   templateUrl: './cart.component.html',
// })
// export class CartComponent {
//   private cartService = inject(CartService);
//   private orderService = inject(OrderService);

//   private router = inject(Router);
//   cartItems = signal<any[]>([]);
//   isLoading = signal<boolean>(false);
//   errorMessage = signal<string | null>(null);

//   constructor() {
//    this.fetchCart();
 

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
//         this.isLoading.set(false);
//       },
//     });
//   }

//   removeItem(item: any) {
//     if (confirm('Are you sure you want to remove this item?')) {
//       this.isLoading.set(true);
//       this.cartService.removeFromCart(item.book._id).subscribe({
//         next: () => {
//           this.fetchCart();
//         },
//         error: (err) => {
//           console.error('Error removing item:', err);
//           this.errorMessage.set('Failed to remove item. Please try again.');
//           this.isLoading.set(false);
//         },
//       });
//     }
//   }

//   increaseQty(item: any) {
//     this.isLoading.set(true);
//     this.cartService.addToCart(item.book._id, 1).subscribe({
//       next: () => {
//         this.fetchCart();
//       },
//       error: (err) => {
//         console.error('Error increasing quantity:', err);
//         this.errorMessage.set('Failed to update quantity. Please try again.');
//         this.isLoading.set(false);
//       },
//     });
//   }

//   decreaseQty(item: any) {
//     this.isLoading.set(true);
//     if (item.quantity <= 1) {
//       this.removeItem(item);
//     } else {
//       this.cartService.addToCart(item.book._id, -1).subscribe({
//         next: () => {
//           this.fetchCart();
//         },
//         error: (err) => {
//           console.error('Error decreasing quantity:', err);
//           this.errorMessage.set('Failed to update quantity. Please try again.');
//           this.isLoading.set(false);
//         },
//       });
//     }
//   }

//   clearCart() {
//     if (confirm('Are you sure you want to clear the cart?')) {
//       this.isLoading.set(true);
//       this.cartService.clearCart().subscribe({
//         next: () => {
//           this.cartItems.set([]);
//           this.isLoading.set(false);
//         },
//         error: (err) => {
//           console.error('Error clearing cart:', err);
//           this.errorMessage.set('Failed to clear cart. Please try again.');
//           this.isLoading.set(false);
//         },
//       });
//     }
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

// onCheckout() {
//   this.orderService.createOrderFromCart().subscribe({
//     next: (res) => {
//       alert('تم إنشاء الطلب بنجاح!');
//       this.router.navigate(['/checkout']); // أو أي مسار لعرض الطلبات
//     },
//     error: (err) => {
//       alert('خطأ أثناء إنشاء الطلب: ' + err.error.message);
//     },
//   });
// }
// }
// // ##############################
// import { Component, inject, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { Router, RouterModule } from '@angular/router';
// import { CartService } from '../core/services/cartservices/cart.service';
// import { OrderService } from '../core/services/orderService/order.service';

// @Component({
//   selector: 'app-cart',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule, RouterModule],
//   templateUrl: './cart.component.html',
// })
// export class CartComponent {
//   private cartService = inject(CartService);
//   private orderService = inject(OrderService);
//   private router = inject(Router);

//   cartItems = signal<any[]>([]);
//   isLoading = signal<boolean>(false);
//   errorMessage = signal<string | null>(null);

//   // Toast flags
//   showSuccessToast = signal(false);
// showErrorToast = signal(false);
// showConfirmRemoveToast = signal(false);

//   // Temp item to remove
//   itemToRemove: any = null;

//   constructor() {
//     this.fetchCart();
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
//         this.isLoading.set(false);
//       },
//     });
//   }

//   // Prompt toast to confirm remove
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
//         this.showConfirmRemoveToast.set(false);
//         this.itemToRemove = null;
//       },
//       error: (err) => {
//         console.error('Error removing item:', err);
//         this.errorMessage.set('Failed to remove item. Please try again.');
//         this.showErrorToast.set(true);
//         this.isLoading.set(false);
//       },
//     });
//   }

//   cancelRemoveItem() {
//     this.itemToRemove = null;
//     this.showConfirmRemoveToast.set(false);
//   }

//   increaseQty(item: any) {
//     this.isLoading.set(true);
//     this.cartService.addToCart(item.book._id, 1).subscribe({
//       next: () => this.fetchCart(),
//       error: (err) => {
//         console.error('Error increasing quantity:', err);
//         this.errorMessage.set('Failed to update quantity. Please try again.');
//         this.showErrorToast.set(true);
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
//         next: () => this.fetchCart(),
//         error: (err) => {
//           console.error('Error decreasing quantity:', err);
//           this.errorMessage.set('Failed to update quantity. Please try again.');
//           this.showErrorToast.set(true);
//           this.isLoading.set(false);
//         },
//       });
//     }
//   }

//   clearCart() {
//     if (confirm('Are you sure you want to clear the cart?')) {
//       this.isLoading.set(true);
//       this.cartService.clearCart().subscribe({
//         next: () => {
//           this.cartItems.set([]);
//           this.showSuccessToast.set(true);
//           this.isLoading.set(false);
//         },
//         error: (err) => {
//           console.error('Error clearing cart:', err);
//           this.errorMessage.set('Failed to clear cart. Please try again.');
//           this.showErrorToast.set(true);
//           this.isLoading.set(false);
//         },
//       });
//     }
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

//   onCheckout() {
//     this.orderService.createOrderFromCart().subscribe({
//       next: () => {
//         this.showSuccessToast.set(true);
//         this.router.navigate(['/checkout']);
//       },
//       error: (err) => {
//         this.errorMessage.set('Order creation failed: ' + err.error.message);
//         this.showErrorToast.set(true);
//       },
//     });
//   }
// }
// #############################################################3
// import { Component, inject, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { Router, RouterModule } from '@angular/router';
// import { CartService } from '../core/services/cartservices/cart.service';
// import { OrderService } from '../core/services/orderService/order.service';

// @Component({
//   selector: 'app-cart',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule, RouterModule],
//   templateUrl: './cart.component.html',
// })
// export class CartComponent {
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

//   // Temp item to remove
//   itemToRemove: any = null;

//   constructor() {
//     this.fetchCart();
//   }

//   private autoCloseToast(toastSignal: any) {
//     setTimeout(() => {
//       toastSignal.set(false);
//     }, 3000); // التوست ستختفي بعد 3 ثوانٍ
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
//     this.isLoading.set(true);
//     this.cartService.addToCart(item.book._id, 1).subscribe({
//       next: () => {
//         this.fetchCart();
//         this.showSuccessToast.set(true);
//         this.autoCloseToast(this.showSuccessToast);
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
//           this.showSuccessToast.set(true);
//           this.autoCloseToast(this.showSuccessToast);
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

//   clearCart() {
//     this.isLoading.set(true);
//     this.cartService.clearCart().subscribe({
//       next: () => {
//         this.cartItems.set([]);
//         this.showSuccessToast.set(true);
//         this.autoCloseToast(this.showSuccessToast);
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

//   getTotalPrice(): number {
//     return this.cartItems().reduce(
//       (total, item) => total + item.book.price * item.quantity,
//       0
//     );
//   }

//   returnToShop() {
//     this.router.navigate(['/home']);
//   }

//   onCheckout() {
//     this.isLoading.set(true);
//     this.orderService.createOrderFromCart().subscribe({
//       next: () => {
//         this.showSuccessToast.set(true);
//         this.autoCloseToast(this.showSuccessToast);
//         this.router.navigate(['/checkout']);
//         this.isLoading.set(false);
//       },
//       error: (err) => {
//         this.errorMessage.set('Order creation failed: ' + err.error.message);
//         this.showErrorToast.set(true);
//         this.autoCloseToast(this.showErrorToast);
//         this.isLoading.set(false);
//       },
//     });
//   }
// }
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../core/services/cartservices/cart.service';
import { OrderService } from '../core/services/orderService/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
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
    }, 3000); // Toasts close after 3 seconds
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
        this.errorMessage.set('Failed to remove item. Please try again.');
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
        this.errorMessage.set('Failed to update quantity. Please try again.');
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
          this.errorMessage.set('Failed to update quantity. Please try again.');
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
        this.errorMessage.set('Failed to clear cart. Please try again.');
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

  onCheckout() {
    this.isLoading.set(true);
    this.orderService.createOrderFromCart().subscribe({
      next: () => {
        this.showSuccessToast.set(true);
        this.autoCloseToast(this.showSuccessToast);
        this.router.navigate(['/checkout']);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Order creation failed: ' + err.error.message);
        this.showErrorToast.set(true);
        this.autoCloseToast(this.showErrorToast);
        this.isLoading.set(false);
      },
    });
  }
}