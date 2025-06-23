import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book } from '../../../assets/books-data/models/book';

@Injectable({
  providedIn: 'root'
})
export class GetBooksService {
  constructor(private http: HttpClient) { }

  get getBooks() {
    return this.http.get<Book[]>('../models/books.json');
  }

}
