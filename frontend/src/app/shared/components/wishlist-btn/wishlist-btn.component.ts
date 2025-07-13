import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { WishlistService } from '../../../core/services/services/wishlist.service';
import { BookInterface } from '../../../core/interfaces/book-interface';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wishlist-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist-btn.component.html',
  styleUrl: './wishlist-btn.component.css',
})
export class WishlistBtnComponent implements OnInit, OnDestroy {
  @Input() book!: BookInterface;
  isInWishlist = false;
  private subscription?: Subscription;

  constructor(private wishlistService: WishlistService) { }

  ngOnInit(): void {
    this.subscription = this.wishlistService.wishlist$.subscribe((wishlist) => {
      this.isInWishlist = wishlist.some((b) => b._id === this.book._id);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  addToWishlist(): void {
    console.log('Trying to add:', this.book);

    if (!this.isInWishlist) {
      this.wishlistService.addToWishlist(this.book).subscribe({
        next: () => {
          console.log('Book added successfully');
        },
        error: (err) => {
          console.error('Failed to add to wishlist:', err);
        },
      });
    }
  }
}
