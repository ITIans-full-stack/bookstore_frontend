import { Component, OnInit } from '@angular/core';
import { BookCardComponent } from '../shared/components/book-card/book-card.component';
import { BookInterface } from '../core/interfaces/book-interface';
import { WishlistService } from '../shared/services/wishlist.service';


@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [BookCardComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  wishlistBooks: BookInterface[] = [];

  constructor(private wishlistService: WishlistService) { }

  ngOnInit(): void {
    this.wishlistService.wishlist$.subscribe((books) => {
      this.wishlistBooks = books;
    });
  }

  remove(bookId: string) {
    this.wishlistService.removeFromWishlist(bookId);
  }
}
