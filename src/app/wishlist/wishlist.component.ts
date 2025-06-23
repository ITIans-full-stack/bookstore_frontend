import { Component } from '@angular/core';
import { RatingComponent } from "../book-details/rating/rating.component";
import { CartBtnComponent } from "../book-details/cart-btn/cart-btn.component";

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RatingComponent, CartBtnComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {

}
