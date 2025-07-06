import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BookInterface } from '../../core/interfaces/book-interface';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlist: BookInterface[] = [];
  private wishlistSubject = new BehaviorSubject<BookInterface[]>([]);

  wishlist$ = this.wishlistSubject.asObservable();

  constructor() {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      this.wishlist = JSON.parse(saved);
      this.wishlistSubject.next(this.wishlist);
    }
  }

  addToWishlist(book: BookInterface): void {
    if (!this.wishlist.some(b => b._id === book._id)) {
      this.wishlist.push(book);
      this.updateWishlist();
    }
  }

  removeFromWishlist(bookId: string): void {
    this.wishlist = this.wishlist.filter(b => b._id !== bookId);
    this.updateWishlist();
  }

  getWishlist(): BookInterface[] {
    return [...this.wishlist];
  }

  private updateWishlist(): void {
    this.wishlistSubject.next(this.wishlist);
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }

  clearWishlist(): void {
    this.wishlist = [];
    this.updateWishlist();
  }
}
