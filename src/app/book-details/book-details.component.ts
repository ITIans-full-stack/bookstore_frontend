import { BookDetailsService } from './services/book-details.service';
import { Component, OnInit } from '@angular/core';
import { RatingComponent } from "./rating/rating.component";
import { BookDetails } from './models/book-details';
import { CurrencyPipe } from '@angular/common';
import { DescriptionComponent } from "./description/description.component";
import { TableDescriptionComponent } from "./table-description/table-description.component";
import { CustomerReviewComponent } from "./customer-review/customer-review.component";





@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [RatingComponent, CurrencyPipe, DescriptionComponent, TableDescriptionComponent, CustomerReviewComponent],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent implements OnInit {
  tabIndex = 1;
  bookDetails?: BookDetails
  constructor(private bookDetailsService: BookDetailsService) { }

  ngOnInit(): void {
    this.bookDetailsService.getBookDetails.subscribe({
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
