import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {Review} from '../../interfaces/review'


// services/review.service.ts
@Injectable({ providedIn: 'root' })
export class ReviewService {
  private apiUrl = 'http://localhost:5000/api/reviews';

  constructor(private http: HttpClient) {}

  getReviews(bookId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/book/${bookId}`);
  }

  addReview(bookId: string, review: any, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${bookId}`, review, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateReview(reviewId: string, review: any, token: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${reviewId}`, review, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  deleteReview(reviewId: string, token: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  canReview(bookId: string, token: string) {
  return this.http.get<{ canReview: boolean }>(
    `${this.apiUrl}/reviews/can-review/${bookId}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
}

}

