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

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {
  @Input() book!: BookInterface;

  private cartService = inject(CartService);

  onAddToCart() {
    this.cartService.addToCart(this.book._id, 1).subscribe({
      next: () => alert('تم إضافة المنتج إلى السلة'),
      error: (err) => alert('حصل خطأ أثناء الإضافة للسلة'),
    });
  }
}
