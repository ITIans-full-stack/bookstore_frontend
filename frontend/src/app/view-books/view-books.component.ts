import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookDetailsService } from '../book-details/services/book-details.service';


@Component({
  selector: 'app-view-books',
  standalone: true,
  imports: [CommonModule], // ✅ Add this line
  templateUrl: './view-books.component.html',
  styleUrls: ['./view-books.component.css']
})
export class ViewBooksComponent implements OnInit {
  books: Book[] = [];

  constructor(private bookService: BookDetailsService) {}

  ngOnInit(): void {
    this.bookService.books$.subscribe(books => {
      this.books = books;
    });
  }
}
