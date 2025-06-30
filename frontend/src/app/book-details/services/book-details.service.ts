import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookDetails } from '../models/book-details';

@Injectable({
  providedIn: 'root'
})
export class BookDetailsService {

  constructor(private http: HttpClient) { }

  get getBookDetails() {
    return this.http.get<BookDetails>('assets/books-data/bookDetails.json')
  }
}
