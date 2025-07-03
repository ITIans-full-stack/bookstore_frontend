import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookInterface } from '../interfaces/book-interface';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookDataService {

 private apiUrl = `${environment.apiUrl}/books`; 

  constructor(private http: HttpClient) {}

  // Get all books
  getBooks(page: number): Observable<BookInterface[]> {
    return this.http.get<BookInterface[]>(`${this.apiUrl}?page=${page}`);
  }

  // Get book by ID
  getBookById(id: string): Observable<BookInterface> {
    return this.http.get<BookInterface>(`${this.apiUrl}/${id}`);
  }
}
