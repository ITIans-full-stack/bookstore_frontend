import { Component, OnInit } from '@angular/core';
import { BookCardComponent } from '../shared/components/book-card/book-card.component';
import { BookInterface } from '../core/interfaces/book-interface';
import { WishlistService } from '../core/services/services/wishlist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [BookCardComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  wishlistBooks: BookInterface[] = [];
  private subscription?: Subscription;

  constructor(private wishlistService: WishlistService) { }

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    // Always load fresh data
    this.wishlistService.loadWishlist();

    this.subscription = this.wishlistService.wishlist$.subscribe((books) => {
      this.wishlistBooks = books || []; // Ensure we always have an array
      console.log('Wishlist books:', this.wishlistBooks); // Debug log
    });
  }

  remove(bookId: string) {
    this.wishlistService.removeFromWishlist(bookId).subscribe({
      next: () => this.loadWishlist(), // Refresh after removal
      error: (err) => console.error('Error removing:', err)
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}