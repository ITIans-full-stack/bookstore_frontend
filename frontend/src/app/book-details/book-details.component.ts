import { BookDetailsService } from './services/book-details.service';
import { CurrencyPipe } from "@angular/common";
import { RatingComponent } from "../shared/components/rating/rating.component";
import { DescriptionComponent } from "./description/description.component";
import { WishlistBtnComponent } from "../shared/components/wishlist-btn/wishlist-btn.component";
import { CartBtnComponent } from "../shared/components/cart-btn/cart-btn.component";
import { RelatedBooksComponent } from "./related-books/related-books.component";
import { Component, OnInit } from "@angular/core";
import { BookDetails } from "./models/book-details";
import { Subscription } from 'rxjs';
import { SocketService } from '../shared/services/socket.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [RatingComponent, CurrencyPipe, DescriptionComponent, WishlistBtnComponent, CartBtnComponent, RelatedBooksComponent],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent implements OnInit {
  tabIndex = 1;
  bookDetails?: BookDetails
  private sub!: Subscription;
  constructor(private BookDetailsService: BookDetailsService, private socketService: SocketService) { }

  ngOnInit(): void {
    this.BookDetailsService.getBookDetails.subscribe({
      next: (data) => {
        this.bookDetails = data
      },
      error: (err) => {
        console.log(err);
      }
    })
    this.sub = this.socketService.onOrderCreated().subscribe(order => {
      console.log('New Order:', order);
      alert(`new order created ${order.orderId}`)
    });
  }

  onTabClick(tabIdx: number) {
    this.tabIndex = tabIdx;
  }

}
