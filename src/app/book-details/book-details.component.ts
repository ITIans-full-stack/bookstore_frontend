import { Component } from '@angular/core';
import { RatingComponent } from "./rating/rating.component";

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [RatingComponent],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent {
  
}
