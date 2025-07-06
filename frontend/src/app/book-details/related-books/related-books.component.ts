import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { BookDataService } from '../../core/services/book-data.service';
import { BookInterface } from '../../core/interfaces/book-interface';

@Component({
  selector: 'app-related-books',
  standalone: true,
  imports: [BookCardComponent, CommonModule],
  templateUrl: './related-books.component.html',
  styleUrl: './related-books.component.css'
})
export class RelatedBooksComponent implements OnInit, OnChanges {
  @Input() bookId!: string;
  relatedBooks: BookInterface[] = [];

  constructor(private bookService: BookDataService) {}

  ngOnInit(): void {
    if (this.bookId) {
      this.fetchRelatedBooks();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookId'] && !changes['bookId'].firstChange) {
      this.fetchRelatedBooks();
    }
  }

  fetchRelatedBooks() {
    this.bookService.getRelatedBooks(this.bookId).subscribe({
      next: (books) => {
        this.relatedBooks = books.filter(book => book._id !== this.bookId);
      },
      error: (err) => {
        console.error('Failed to load related books', err);
      },
    });
  }
}
