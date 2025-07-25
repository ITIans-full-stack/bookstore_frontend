import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookInterface } from '../interfaces/book-interface';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BookDataService {

 private apiUrl = `${environment.apiUrl}/books`; 

  constructor(private http: HttpClient) {}

  // Get books with pagination
  getBooks(page: number ,limit:number): Observable<BookInterface[]> {
    return this.http.get<BookInterface[]>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }
  // Get all books
  getAllBooks(): Observable<BookInterface[]> {
    return this.http.get<BookInterface[]>(`${this.apiUrl}`);
  }

  // Get book by ID
  getBookById(id: string): Observable<BookInterface> {
    return this.http.get<BookInterface>(`${this.apiUrl}/${id}`);
  }
  // Add book 
   addBook(bookData: FormData) {
  return this.http.post(`${this.apiUrl}`, bookData);
}

 updateBookById(id: string, formData: FormData): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, formData);
}

  getRelatedBooks(bookId: string) {
  return this.http.get<BookInterface[]>(`${this.apiUrl}/${bookId}/related`);
}

  deleteBookById(id: string): Observable<BookInterface> {
    return this.http.delete<BookInterface>(`${this.apiUrl}/${id}`);
  }

  //get categories
   getCategories(): Observable<string[]> {
    return this.http.get<{ data: string[] }>(`${this.apiUrl}/categories`).pipe(
      map((res) => res.data)
    );
  }
//top sales
  getTopSalesBooks() {
  return this.http.get<{ data: BookInterface[] }>(`${this.apiUrl}/top-sales`);
}
//top rated

getTopRatedBooks() {
  return this.http.get<{ data: BookInterface[] }>(`${this.apiUrl}/top-rated`);
}
//newest

getNewestBooks() {
  return this.http.get<{ data: BookInterface[] }>(`${this.apiUrl}/newest`);
}
//get authors
getAllAuthors() {
  return this.http.get<{ data: string[] }>(`${this.apiUrl}/authors`);
}


//search
searchBooks(type: string, keyword: string) {
  return this.http.get<any>(`${this.apiUrl}/search?type=${type}&keyword=${keyword}`);
}
}
