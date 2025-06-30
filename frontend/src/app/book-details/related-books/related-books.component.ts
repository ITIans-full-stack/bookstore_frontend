import { Component } from '@angular/core';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';

@Component({
  selector: 'app-related-books',
  standalone: true,
  imports: [BookCardComponent],
  templateUrl: './related-books.component.html',
  styleUrl: './related-books.component.css'
})
export class RelatedBooksComponent {

}
