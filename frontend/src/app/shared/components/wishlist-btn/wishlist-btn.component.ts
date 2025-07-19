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
  styleUrls: ['./wishlist-btn.component.css'],
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

  toggleWishlist(): void {
    if (!this.book?._id) return;

    this.wishlistService.toggleWishlist(this.book).subscribe({
      next: () => {
        console.log('Wishlist toggled successfully');
      },
      error: (err) => {
        console.error('Failed to toggle wishlist:', err);
      }
    });
  }
}
