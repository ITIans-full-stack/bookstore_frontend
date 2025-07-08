import { Component, Input, OnInit,Output,EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../core/services/reviewservices/review.service';
import { Review } from '../core/interfaces/review';

@Component({
  selector: 'app-review',
  standalone: true,  
  imports:[CommonModule, FormsModule],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  @Input() bookId!: string
  @Input() reviews: Review[] = [];
  @Output() refresh = new EventEmitter<void>();
  canWriteReview: boolean = false;
  allReviews: Review[] = [];
  visibleReviews: Review[] = [];
  showAll: boolean = false;
  newReview: { rating: number; comment: string } = { rating: 0, comment: '' };
  editingReviewId: string | null = null;
  editedReview: { rating: number; comment: string } = { rating: 0, comment: '' };

  constructor(private reviewService: ReviewService) {}
  showForm: boolean = false;
  errorMessage: string = '';
  ngOnInit(): void {
    this.loadReviews();
    this.checkReviewPermission();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  loadReviews() {
  this.reviewService.getReviews(this.bookId).subscribe({
    next: (data) => {
      this.allReviews = data
        .filter(r => r.createdAt)
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

      this.visibleReviews = this.allReviews.slice(0, 3);
    },
    error: (err) => {
      console.error('Error loading reviews:', err);
    }
  });
}
toggleShowAll() {
  this.showAll = !this.showAll;
  this.visibleReviews = this.showAll ? this.allReviews : this.allReviews.slice(0, 3);
}

  addReview() {
    const token = this.getToken();
    if (!token) return alert('Please log in');
    console.log("token:=>" ,token)
    this.reviewService.addReview(this.bookId, this.newReview, token).subscribe({
      next: () => {
        this.newReview = { rating: 0, comment: '' };
        this.loadReviews();
        this.refresh.emit();
      },
      error: (err) => {
        console.error('Add review error:', err);
      }
    });
  }

  startEdit(review: Review) {
    this.editingReviewId = review._id!;
    this.editedReview = {
      rating: review.rating,
      comment: review.comment
    };
  }

  updateReview() {
    const token = this.getToken();
    if (!token || !this.editingReviewId) return;

    this.reviewService
      .updateReview(this.editingReviewId, this.editedReview, token)
      .subscribe({
        next: () => {
          this.editingReviewId = null;
          this.loadReviews();
          this.refresh.emit();
        },
        error: (err) => {
          console.error('Update review error:', err);
        }
      });
  }

  deleteReview(reviewId: string) {
    const token = this.getToken();
    if (!token) return;

    this.reviewService.deleteReview(reviewId, token).subscribe({
      next: () =>{ this.loadReviews()
                  this.refresh.emit();
      },
      error: (err) => console.error('Delete review error:', err)
    });
    
  }

  getCurrentUserId(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || payload._id;
  } catch (e) {
    return null;
  }
}

checkReviewPermission() {
  const token = this.getToken();
  if (!token) {
    this.errorMessage = 'Please log in to write a review.';
    return;
  }

  this.reviewService.canReview(this.bookId, token).subscribe({
    next: (res) => {
      this.canWriteReview = res.canReview;
      this.errorMessage = '';
    },
    error: (err) => {
      if (err.status === 403) {
        this.canWriteReview = false;
        this.errorMessage = 'You can only review books you have purchased.';
      } else {
        this.errorMessage = 'Something went wrong. Try again later.';
      }
    }
  });
}


  cancelEdit() {
    this.editingReviewId = null;
  }
}
