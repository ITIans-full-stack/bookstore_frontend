import { Component, Input } from '@angular/core';
import { RatingComponent } from '../rating/rating.component';
import { WishlistBtnComponent } from '../wishlist-btn/wishlist-btn.component';
import { BookInterface } from '../../../core/interfaces/book-interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule,RatingComponent, WishlistBtnComponent],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {
  @Input() book!: BookInterface;

     constructor(private router: Router) {}

  goToDetails() {
    this.router.navigate(['/books', this.book._id]);
  }

  addToCart(event: Event) {
  event.stopPropagation(); 
  console.log('Add to Cart clicked');
}
}
