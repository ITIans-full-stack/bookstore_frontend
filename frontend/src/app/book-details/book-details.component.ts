// import { SocketService } from './../shared/services/socket.service';
// import { BookDetailsService } from './services/book-details.service';
// import { CurrencyPipe } from "@angular/common";
import { RatingComponent } from "../shared/components/rating/rating.component";
// import { DescriptionComponent } from "./description/description.component";
// import { WishlistBtnComponent } from "../shared/components/wishlist-btn/wishlist-btn.component";
// import { CartBtnComponent } from "../shared/components/cart-btn/cart-btn.component";
import { RelatedBooksComponent } from "./related-books/related-books.component";
// import { Component, OnInit } from "@angular/core";
// import { BookDetails } from "./models/book-details";
// import { ReviewService } from '../core/services/reviewservices/review.service';

// @Component({
//   selector: 'app-book-details',
//   standalone: true,
//   imports: [RatingComponent, CurrencyPipe, DescriptionComponent, WishlistBtnComponent, CartBtnComponent, RelatedBooksComponent],
//   templateUrl: './book-details.component.html',
//   styleUrl: './book-details.component.css'
// })
// export class BookDetailsComponent implements OnInit {
//   tabIndex = 1;
//   bookDetails?: BookDetails
//   constructor(private BookDetailsService: BookDetailsService, private socketService: SocketService, private reviewService: ReviewService) { }

//   ngOnInit(): void {
//     this.BookDetailsService.getBookDetails.subscribe({
//       next: (data) => {
//         this.bookDetails = data
//       },
//       error: (err) => {
//         console.log(err);
//       }
//     })
//     //for test now and when admin work correctly will be injected this service
//     this.socketService.onOrderCreated().subscribe((orderData) => {
//       console.log(orderData);
//       alert(`${orderData.orderId}`);
//     });
//   }



//   onTabClick(tabIdx: number) {
//     this.tabIndex = tabIdx;
//   }

// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookDataService } from '../core/services/book-data.service';
import {ReviewComponent} from '../review/review.component'
import { ReviewService } from '../core/services/reviewservices/review.service';
import { Review } from '../core/interfaces/review';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-details',
  imports:[RelatedBooksComponent,RatingComponent,ReviewComponent,CommonModule],
  standalone: true,
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  bookId!: string;
  book: any;
  reviews: Review[] = [];
  ratingDistribution: { [key: number]: number } = {};

  constructor(
    private route: ActivatedRoute,
    private bookService: BookDataService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.bookId = this.route.snapshot.params['id'];
    this.loadBook();
    this.loadReviews();
  }

  loadBook() {
    this.bookService.getBookById(this.bookId).subscribe((res) => {
      this.book = res;
    });
  }

  loadReviews() {
    this.reviewService.getReviews(this.bookId).subscribe((res) => {
      this.reviews = res;
      this.calculateAverageRatingAndDistribution();
    });
  }
getFloor(value: number): number {
  return Math.floor(value);
}

getCeil(value: number): number {
  return Math.ceil(value);
}


calculateAverageRatingAndDistribution(): void {
  const totalRatings = this.reviews.length;
  if (totalRatings === 0) {
    this.book.averageRating = 0;
    this.ratingDistribution = {};
    return;
  }

  const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  this.book.averageRating = total / totalRatings;

  const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  this.reviews.forEach((r) => distribution[r.rating]++);
  for (let key in distribution) {
    distribution[+key] = (distribution[+key] / totalRatings) * 100;
  }

  this.ratingDistribution = distribution;
}



  refreshReviews() {
    this.loadReviews();
  }
}
