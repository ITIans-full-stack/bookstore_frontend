import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RatingComponent } from '../shared/components/rating/rating.component';
import { CartBtnComponent } from '../shared/components/cart-btn/cart-btn.component';


@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RatingComponent, CartBtnComponent,RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {

}
