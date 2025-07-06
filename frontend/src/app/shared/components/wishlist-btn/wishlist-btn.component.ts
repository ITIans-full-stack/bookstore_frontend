import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { BookInterface } from '../../../core/interfaces/book-interface';

@Component({
  selector: 'app-wishlist-btn',
  standalone: true,
  imports: [],
  templateUrl: './wishlist-btn.component.html',
  styleUrl: './wishlist-btn.component.css',
})
export class WishlistBtnComponent {
  @Input() book!: BookInterface;

  constructor(
    private wishlistService: WishlistService,
    private router: Router
  ) { }

  addToWishlist(): void {
    this.wishlistService.addToWishlist(this.book);
    this.router.navigate(['/wishlist']);
  }
}
