import { Component } from '@angular/core';
import { RatingComponent } from "../../rating/rating.component";
import { WishlistBtnComponent } from "../../wishlist-btn/wishlist-btn.component";

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [RatingComponent, WishlistBtnComponent],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {

}
