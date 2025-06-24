import { Component } from '@angular/core';
import { RatingComponent } from "../book-details/rating/rating.component";
import { CartBtnComponent } from "../book-details/cart-btn/cart-btn.component";
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RatingComponent, CartBtnComponent,RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {

}
