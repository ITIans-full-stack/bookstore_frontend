import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../book-details/models/book';
import { BookDataService } from '../../core/services/book-data.service';
import { BookInterface } from '../../core/interfaces/book-interface';


@Component({
  selector: 'app-view-books',
  standalone: true,
  imports: [CommonModule], // ✅ Add this line
  templateUrl: './view-books.component.html',
  styleUrls: ['./view-books.component.css']
})
export class ViewBooksComponent implements OnInit {
  books: BookInterface[] = [];

  constructor(private bookService: BookDataService) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe({
  next: (res: any) => {
    if (Array.isArray(res.data)) {
      this.books = res.data;
    } else {
      console.error('Data is not an array:', res);
    }
  },
  error: (err) => {
    console.error('Error fetching books:', err);
  }
});
  }
}
