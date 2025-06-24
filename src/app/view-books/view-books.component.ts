import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService, Book } from '../book.service'; // adjust the path if needed

@Component({
  selector: 'app-view-books',
  standalone: true,
  imports: [CommonModule], // ✅ Add this line
  templateUrl: './view-books.component.html',
  styleUrls: ['./view-books.component.css']
})
export class ViewBooksComponent implements OnInit {
  books: Book[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.books$.subscribe(books => {
      this.books = books;
    });
  }
}
