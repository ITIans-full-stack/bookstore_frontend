import { BookDetailsService } from './services/book-details.service';
import { CurrencyPipe } from "@angular/common";
import { RatingComponent } from "../shared/components/rating/rating.component";
import { DescriptionComponent } from "./description/description.component";
import { WishlistBtnComponent } from "../shared/components/wishlist-btn/wishlist-btn.component";
import { CartBtnComponent } from "../shared/components/cart-btn/cart-btn.component";
import { RelatedBooksComponent } from "./related-books/related-books.component";
import { Component, OnInit } from "@angular/core";
import { BookDetails } from "./models/book-details";

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
  constructor(private BookDetailsService: BookDetailsService) { }

  ngOnInit(): void {
    this.BookDetailsService.getBookDetails.subscribe({
      next: (data) => {
        this.bookDetails = data
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onTabClick(tabIdx: number) {
    this.tabIndex = tabIdx;
  }

}
