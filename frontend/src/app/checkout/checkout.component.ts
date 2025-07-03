// import { Component, OnInit, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-checkout',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, FormsModule],
//   templateUrl: './checkout.component.html',
//   styleUrls: ['./checkout.component.css']
// })
// export class CheckoutComponent implements OnInit {
//   fb = inject(FormBuilder);
//   checkoutForm!: FormGroup;
//   paymentMethod: string = 'card';
//   cartItems = [
//     { title: 'LCD Monitor', price: 650, image: 'https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg' },
//     { title: 'Gaming Pad', price: 100, image: 'https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg' }
//   ];
//   loading: boolean = false;


//   stripe: any;
//   card: any;

//   ngOnInit(): void {
//     this.checkoutForm = this.fb.group({
//       firstName: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       address: ['', Validators.required],
//       city: ['', Validators.required],
//       phone: ['', Validators.required]
//     });

//     this.setupStripe();
//   }

//   getSubtotal(): number {
//     return this.cartItems.reduce((acc, item) => acc + item.price, 0);
//   }

//   setupStripe(): void {
   
//     if (!(window as any).Stripe) {
//       console.error('Stripe.js not loaded. Please include <script src="https://js.stripe.com/v3/"></script> in index.html');
//       return;
//     }

//     this.stripe = (window as any).Stripe('pk_test_51RRAPZPh6I2dCw4UwbapbzAKwyPBa9UqzjMfGssEjKsvfZEx9emvjiuGY5FP0tN4wG2yG25xs16aK2fhaSkKJ8sg00cKkQz1wk'); 
//     const elements = this.stripe.elements();
//     this.card = elements.create('card', {
//       style: {
//         base: {
//           fontSize: '16px',
//           color: '#333',
//           '::placeholder': {
//             color: '#888'
//           }
//         }
//       }
//     });
//     this.card.mount('#card-element');

//     this.card.on('change', (event: any) => {
//       const displayError = document.getElementById('card-errors');
//       if (displayError) {
//         displayError.textContent = event.error ? event.error.message : '';
//       }
//     });
//   }

//   async submitOrder(): Promise<void> {
//     if (this.checkoutForm.invalid) {
//       console.error('Form is invalid');
//       return;
//     }

//     this.loading = true;

//     if (this.paymentMethod === 'card') {
//       if (!this.stripe || !this.card) {
//         console.error('Stripe or Card not initialized');
//         this.loading = false;
//         return;
//       }

//       try {
//         const { paymentMethod, error } = await this.stripe.createPaymentMethod({
//           type: 'card',
//           card: this.card,
//           billing_details: {
//             name: this.checkoutForm.value.firstName,
//             email: this.checkoutForm.value.email,
//             address: {
//               line1: this.checkoutForm.value.address,
//               city: this.checkoutForm.value.city,
//               phone: this.checkoutForm.value.phone
//             }
//           }
//         });

//         if (error) {
//           const displayError = document.getElementById('card-errors');
//           if (displayError) displayError.textContent = error.message;
//           this.loading = false;
//           return;
//         }

//         console.log('PaymentMethod ID:', paymentMethod.id);
//         // هنا يجب إرسال paymentMethod.id إلى الخادم الخلفي لإكمال الدفع
//         // مثال: await this.http.post('/api/create-payment-intent', { paymentMethodId: paymentMethod.id, amount: this.getSubtotal() * 100 }).toPromise();
//         alert('Payment processed successfully! (Pending server confirmation)');
//       } catch (error) {
//         console.error('Payment error:', error);
//         this.loading = false;
//       }
//     } else {
      
//       console.log('Cash on Delivery selected. Order placed with total:', this.getSubtotal(), 'EGP');
//       alert('Order placed with Cash on Delivery!');
//       this.loading = false;
//     }
//   }

//   setPaymentMethod(method: string): void {
//     this.paymentMethod = method;
//   }
// }

// ##################
// import { Component, OnInit, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { FormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// declare var paypal: any;
// @Component({
//   selector: 'app-checkout',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, FormsModule],
//   templateUrl: './checkout.component.html',
//   styleUrls: ['./checkout.component.css']
// })

// export class CheckoutComponent implements OnInit {
//   fb = inject(FormBuilder);
//   http = inject(HttpClient);
//   checkoutForm!: FormGroup;
//   cartItems = [
//     { title: 'LCD Monitor', price: 650, image: 'https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg',quantity: 1 },
//     { title: 'Gaming Pad', price: 100, image: 'https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg',quantity: 1 }
//   ];
//   loading: boolean = false;
//   paypalLoaded = false;


//   ngOnInit(): void {
//     this.checkoutForm = this.fb.group({
//       firstName: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       address: ['', Validators.required],
//       city: ['', Validators.required],
//       phone: ['', Validators.required]
//     });

//     this.loadPaypalScript().then(() => {
//       this.renderPaypalButtons();
//     });
//   }

//   getSubtotal(): number {
//     return this.cartItems.reduce((acc, item) => acc + item.price, 0);
//   }

//   loadPaypalScript(): Promise<void> {
//     return new Promise((resolve) => {
//       if (this.paypalLoaded) {
//         resolve();
//         return;
//       }

//       const script = document.createElement('script');
//       script.src = 'https://www.paypal.com/sdk/js?client-id=AaHqaL_vPFFmnzg8s1QaOlLM1lc52raWwLeD9IbHlK7mExAkfyOIv_qIVHuXjifdm8nIPoLrAHB1seNi&currency=USD';
//       script.onload = () => {
//         this.paypalLoaded = true;
//         resolve();
//       };
//       document.body.appendChild(script);
//     });
//   }

//   renderPaypalButtons(): void {
//     const total = this.getSubtotal();

//     paypal.Buttons({
//       createOrder: (data: any, actions: any) => {
//         return fetch('http://localhost:5000/api/payment/create-order', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ total })
//         })
//           .then((res) => res.json())
//           .then((data) => data.id);
//       },

//       onApprove: (data: any, actions: any) => {
//         return fetch(`http://localhost:5000/api/payment/capture-order/${data.orderID}`, {
//           method: 'POST'
//         })
//           .then((res) => res.json())
//           .then((details) => {
//             alert('✅ Payment Successful!');
//             console.log('Payment Details:', details);
//             this.submitOrder();
//           });
//       },

//       onError: (err: any) => {
//         console.error('❌ PayPal error:', err);
//       }
//     }).render('#paypal-button');
//   }

//   submitOrder(): void {
//     if (this.checkoutForm.invalid) {
//       console.error('Form is invalid');
//       return;
//     }

//     const orderData = {
//       shippingAddress: this.checkoutForm.value,
//       cartItems: this.cartItems
//     };

//     this.loading = true;

//     this.http.post('http://localhost:5000/api/orders', orderData).subscribe({
//       next: (res) => {
//         alert('Order Placed Successfully!');
//         this.loading = false;
//         // ممكن تعملي Redirect أو تنظفي الكارت هنا
//       },
//       error: (err) => {
//         console.error(err);
//         alert('Error placing order.');
//         this.loading = false;
//       }
//     });
//   }
// }
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare var paypal: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);

  checkoutForm!: FormGroup;
  cartItems = [
    { title: 'LCD Monitor', price: 650, image: 'https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg', quantity: 1 },
    { title: 'Gaming Pad', price: 100, image: 'https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg', quantity: 1 }
  ];
  loading: boolean = false;
  paypalLoaded = false;

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required]
    });

    this.loadPaypalScript().then(() => {
      this.renderPaypalButtons();
    });
  }

  getSubtotal(): number {
    return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  loadPaypalScript(): Promise<void> {
    return new Promise((resolve) => {
      if (this.paypalLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=AaHqaL_vPFFmnzg8s1QaOlLM1lc52raWwLeD9IbHlK7mExAkfyOIv_qIVHuXjifdm8nIPoLrAHB1seNi&currency=USD';
      script.onload = () => {
        this.paypalLoaded = true;
        resolve();
      };
      document.body.appendChild(script);
    });
  }

  renderPaypalButtons(): void {
    const total = this.getSubtotal();

    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
  return actions.order.create({
    purchase_units: [{
      amount: {
        value: total.toString()
      }
    }]
  });
},

      // createOrder: (data: any, actions: any) => {
      //   return fetch('http://localhost:5000/api/payment/create-order', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({ total })
      //   })
      //     .then((res) => res.json())
      //     .then((data) => data.id);
      // },

      onApprove: (data: any, actions: any) => {
        return fetch(`http://localhost:5000/api/payment/capture-order/${data.orderID}`, {
          method: 'POST'
        })
          .then((res) => res.json())
          .then((details) => {
            alert('✅ Payment Successful!');
            console.log('Payment Details:', details);
            this.submitOrder();
          });
      },

      onError: (err: any) => {
        console.error('❌ PayPal error:', err);
        alert('Something went wrong during payment.');
      }
    }).render('#paypal-button');
  }

  submitOrder(): void {
    if (this.checkoutForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    const orderData = {
      shippingAddress: this.checkoutForm.value,
      cartItems: this.cartItems
    };

    this.loading = true;

    this.http.post('http://localhost:5000/api/orders', orderData).subscribe({
      next: (res) => {
        alert('Order Placed Successfully!');
        this.cartItems = [];
        this.checkoutForm.reset();
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        alert('Error placing order.');
        this.loading = false;
      }
    });
  }
}
