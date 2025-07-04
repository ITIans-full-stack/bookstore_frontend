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

  constructor(private router: Router, private cartService: CartService) {}

  onAddToCart() {
    this.cartService.addToCart(this.book._id, 1).subscribe({
      next: () => alert('Product added to cart successfully'),
      error: (err) => alert('Failed to add product to cart'),
    });
  }

  goToDetails() {
    this.router.navigate(['/books', this.book._id]);
  }}