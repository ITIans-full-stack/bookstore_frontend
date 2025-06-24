import { Component, inject, OnInit } from '@angular/core';
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
    { title: 'LCD Monitor', price: 650, image:'https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg' },
    { title: 'Gaming Pad', price: 100, image: 'https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg' }
  ];

  stripe: any;
  card: any;

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      company: [''],
      address: ['', Validators.required],
      apt: [''],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.setupStripe();
  }

  getSubtotal(): number {
    return this.cartItems.reduce((acc, item) => acc + item.price, 0);
  }

  setupStripe(): void {
    // تأكد من تحميل مكتبة Stripe في index.html
    if (!(window as any).Stripe) {
      console.error('Stripe.js not loaded. Make sure to include it in index.html');
      return;
    }

    this.stripe = (window as any).Stripe('pk_test_123456789'); // replace with actual Stripe key
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');

    this.card.on('change', (event: any) => {
      const displayError = document.getElementById('card-errors');
      if (event.error && displayError) {
        displayError.textContent = event.error.message;
      } else if (displayError) {
        displayError.textContent = '';
      }
    });
  }

  async submitOrder() {
    if (this.paymentMethod === 'card') {
      if (!this.stripe || !this.card) {
        console.error('Stripe or Card not initialized');
        return;
      }

      const { paymentMethod, error } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.card,
        billing_details: {
          name: this.checkoutForm.value.firstName,
          email: this.checkoutForm.value.email
        }
      });

      if (error) {
        console.error(error);
        return;
      }

      console.log('Stripe PaymentMethod ID:', paymentMethod.id);
      // Send this ID to backend for payment intent
    } else {
      console.log('Cash on Delivery selected');
      // Handle COD flow
    }
  }

  setPaymentMethod(method: string) {
    this.paymentMethod = method;
  }
}
