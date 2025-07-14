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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookDataService } from '../core/services/book-data.service';
import { ReviewComponent } from '../review/review.component'
import { ReviewService } from '../core/services/reviewservices/review.service';
import { Review } from '../core/interfaces/review';
import { CommonModule, ViewportScroller } from '@angular/common';
import { WishlistBtnComponent } from '../shared/components/wishlist-btn/wishlist-btn.component';
import { faStar as faStarSolid, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChatbotComponent } from "../chatbot/chatbot.component";
import { OrderService } from "../core/services/orderService/order.service";
import { BookInterface } from "../core/interfaces/book-interface";
import { CartBtnComponent } from "../shared/components/cart-btn/cart-btn.component";
import { environment } from "../../environments/environment";
import { WishlistService } from "../core/services/services/wishlist.service";
@Component({
  selector: 'app-book-details',
  imports: [RelatedBooksComponent,
    RatingComponent,
    ReviewComponent,
    CommonModule,
    WishlistBtnComponent,
    ChatbotComponent,
    FontAwesomeModule
    , CartBtnComponent,],
  standalone: true,
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  bookId!: string;
  book: any;
  showFullDescription = false;
  isLongDescription = false;
  reviews: Review[] = [];
  ratingDistribution: { [key: number]: number } = {};
  fullStar = faStarSolid;
  halfStar = faStarHalfAlt;
  emptyStar = faStarRegular;
  imageList: string[] = [];
  orders: any[] = [];
  summaryText: string = '';
  isSummarizing: boolean = false;



  constructor(
    private route: ActivatedRoute,
    private bookService: BookDataService,
    private reviewService: ReviewService,
    private viewportScroller: ViewportScroller,
    private orderservice: OrderService,
    private router: Router,
    private http: HttpClient,
    private wishlistService: WishlistService
  ) { }
  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.bookId = params['id'];
      this.scrollToTop();
      this.loadBook();
      this.loadReviews();
      this.loadOrders();
    });
  }
  scrollToTop(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }


  loadBook() {
    this.bookService.getBookById(this.bookId).subscribe((res) => {
      this.book = res;
      if (this.reviews.length > 0) {
        this.calculateAverageRatingAndDistribution();
      }

      if (this.book) {
        const additionalImages = this.book.images || [];
        const allImages = [this.book.image, ...additionalImages];
        this.imageList = Array.from(new Set(allImages));
      }
    });
  }

  loadReviews() {
    this.reviewService.getReviews(this.bookId).subscribe((res) => {
      this.reviews = res;
      if (this.book) {
        this.calculateAverageRatingAndDistribution();
      }
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

  getStarIcon(index: number): any {
    if (!this.book || this.book.averageRating === undefined) return this.emptyStar;

    const rating = this.book.averageRating;

    if (index + 1 <= rating) return this.fullStar;
    if (rating > index && rating < index + 1) return this.halfStar;
    return this.emptyStar;
  }

  refreshReviews() {
    this.loadReviews();
  }


  loadOrders() {
    this.orderservice.getMyOrders().subscribe({
      next: (res: any) => {
        this.orders = res.orders || [];

      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      }
    });
  }

  isBookOrdered(): boolean {
    if (!this.book || !this.orders) return false;

    return this.orders.some(order =>
      order.books.some((item: any) =>
        item.book && item.book._id === this.book._id
      )
    );
  }


  summarizeBook(pdfUrl: string): void {
    if (!pdfUrl) return;
    this.router.navigate(['/summarizer'], { queryParams: { pdf: pdfUrl } });
  }


}



