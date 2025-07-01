import { Component } from '@angular/core';
import { BookCardComponent } from '../shared/components/book-card/book-card.component';


@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [ BookCardComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {

}
