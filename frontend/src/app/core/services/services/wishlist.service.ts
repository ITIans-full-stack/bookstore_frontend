import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BookInterface } from '../../interfaces/book-interface';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlistItems: any[] = []; // Store complete wishlist items
  private wishlistSubject = new BehaviorSubject<BookInterface[]>([]);
  wishlist$ = this.wishlistSubject.asObservable();

  private readonly API_URL = `${environment.apiUrl}/wishlist`;

  constructor(private http: HttpClient) { }

  private getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.id || null;
    } catch (err) {
      console.error('Failed to decode token:', err);
      return null;
    }
  }

  loadWishlist(): void {
    const userId = this.getUserIdFromToken();
    if (!userId) {
      console.warn('No user ID found in token');
      return;
    }

    this.http.get<any[]>(`${this.API_URL}/${userId}`).pipe(
      catchError(err => {
        console.error('Failed to load wishlist:', err);
        return throwError(() => err);
      })
    ).subscribe({
      next: (items) => {
        this.wishlistItems = items;
        this.updateWishlist();
      },
      error: (err) => console.error('Error in wishlist subscription:', err)
    });
  }

  // addToWishlist(book: BookInterface): Observable<any> {
  //   const userId = this.getUserIdFromToken();
  //   if (!userId) {
  //     return throwError(() => 'User not authenticated');
  //   }
  //   if (!book?._id) {
  //     return throwError(() => 'Invalid book');
  //   }

  //   if (this.isBookInWishlist(book._id)) {
  //     return throwError(() => 'Book already in wishlist');
  //   }

  //   // Change 'userId' key to 'user' here:
  //   return this.http.post<any>(this.API_URL, { user: userId, bookId: book._id }).pipe(
  //     tap((newItem) => {
  //       this.wishlistItems.push(newItem);
  //       this.updateWishlist();
  //     }),
  //     catchError(err => {
  //       console.error('Failed to add to wishlist:', err);
  //       return throwError(() => err);
  //     })
  //   );
  // }
  toggleWishlist(book: BookInterface): Observable<any> {
    const userId = this.getUserIdFromToken();
    if (!userId) return throwError(() => 'User not authenticated');
    if (!book?._id) return throwError(() => 'Invalid book');

    const isInWishlist = this.isBookInWishlist(book._id);

    if (isInWishlist) {
      const wishlistItem = this.wishlistItems.find(item => item.book._id === book._id);
      if (!wishlistItem) return throwError(() => 'Wishlist item not found');

      return this.http.delete(`${this.API_URL}/${wishlistItem._id}`).pipe(
        tap(() => {
          this.wishlistItems = this.wishlistItems.filter(item => item._id !== wishlistItem._id);
          this.updateWishlist();
        }),
        catchError(err => {
          console.error('Failed to remove from wishlist:', err);
          return throwError(() => err);
        })
      );
    } else {
      return this.http.post<any>(this.API_URL, { user: userId, bookId: book._id }).pipe(
        tap((newItem) => {
          this.wishlistItems.push(newItem);
          this.updateWishlist();
        }),
        catchError(err => {
          console.error('Failed to add to wishlist:', err);
          return throwError(() => err);
        })
      );
    }
  }

  removeFromWishlist(bookId: string): Observable<any> {
    const userId = this.getUserIdFromToken();
    if (!userId) {
      return throwError(() => 'User not authenticated');
    }
    if (!bookId) {
      return throwError(() => 'Invalid book ID');
    }

    const wishlistItem = this.wishlistItems.find(item => item.book._id === bookId);
    if (!wishlistItem) {
      return throwError(() => 'Book not found in wishlist');
    }

    return this.http.delete(`${this.API_URL}/${wishlistItem._id}`).pipe(
      tap(() => {
        this.wishlistItems = this.wishlistItems.filter(item => item._id !== wishlistItem._id);
        this.updateWishlist();
      }),
      catchError(err => {
        console.error('Failed to remove from wishlist:', err);
        return throwError(() => err);
      })
    );
  }

  getWishlist(): BookInterface[] {
    return this.wishlistItems.map(item => item.book);
  }

  clearWishlist(): void {
    this.wishlistItems = [];
    this.updateWishlist();
  }

  private updateWishlist(): void {
    this.wishlistSubject.next(this.getWishlist());
  }

  isBookInWishlist(bookId: string): boolean {
    return this.wishlistItems.some(item => item.book._id === bookId);
  }

  getWishlistItemId(bookId: string): string | undefined {
    const item = this.wishlistItems.find(item => item.book._id === bookId);
    return item?._id;
  }
}