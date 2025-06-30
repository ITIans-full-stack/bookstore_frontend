import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  fb = inject(FormBuilder);
  checkoutForm!: FormGroup;
  paymentMethod: string = 'card';
  cartItems = [
    { title: 'LCD Monitor', price: 650, image: 'https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg' },
    { title: 'Gaming Pad', price: 100, image: 'https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg' }
  ];
  loading: boolean = false;


  stripe: any;
  card: any;

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required]
    });

    this.setupStripe();
  }

  getSubtotal(): number {
    return this.cartItems.reduce((acc, item) => acc + item.price, 0);
  }

  setupStripe(): void {
   
    if (!(window as any).Stripe) {
      console.error('Stripe.js not loaded. Please include <script src="https://js.stripe.com/v3/"></script> in index.html');
      return;
    }

    this.stripe = (window as any).Stripe('pk_test_51RRAPZPh6I2dCw4UwbapbzAKwyPBa9UqzjMfGssEjKsvfZEx9emvjiuGY5FP0tN4wG2yG25xs16aK2fhaSkKJ8sg00cKkQz1wk'); 
    const elements = this.stripe.elements();
    this.card = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#333',
          '::placeholder': {
            color: '#888'
          }
        }
      }
    });
    this.card.mount('#card-element');

    this.card.on('change', (event: any) => {
      const displayError = document.getElementById('card-errors');
      if (displayError) {
        displayError.textContent = event.error ? event.error.message : '';
      }
    });
  }

  async submitOrder(): Promise<void> {
    if (this.checkoutForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    this.loading = true;

    if (this.paymentMethod === 'card') {
      if (!this.stripe || !this.card) {
        console.error('Stripe or Card not initialized');
        this.loading = false;
        return;
      }

      try {
        const { paymentMethod, error } = await this.stripe.createPaymentMethod({
          type: 'card',
          card: this.card,
          billing_details: {
            name: this.checkoutForm.value.firstName,
            email: this.checkoutForm.value.email,
            address: {
              line1: this.checkoutForm.value.address,
              city: this.checkoutForm.value.city,
              phone: this.checkoutForm.value.phone
            }
          }
        });

        if (error) {
          const displayError = document.getElementById('card-errors');
          if (displayError) displayError.textContent = error.message;
          this.loading = false;
          return;
        }

        console.log('PaymentMethod ID:', paymentMethod.id);
        // هنا يجب إرسال paymentMethod.id إلى الخادم الخلفي لإكمال الدفع
        // مثال: await this.http.post('/api/create-payment-intent', { paymentMethodId: paymentMethod.id, amount: this.getSubtotal() * 100 }).toPromise();
        alert('Payment processed successfully! (Pending server confirmation)');
      } catch (error) {
        console.error('Payment error:', error);
        this.loading = false;
      }
    } else {
      
      console.log('Cash on Delivery selected. Order placed with total:', this.getSubtotal(), 'EGP');
      alert('Order placed with Cash on Delivery!');
      this.loading = false;
    }
  }

  setPaymentMethod(method: string): void {
    this.paymentMethod = method;
  }
}