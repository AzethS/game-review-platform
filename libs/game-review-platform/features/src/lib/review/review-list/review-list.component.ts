import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReviewService } from '../review.service';
import { IReview } from '@game-platform/shared/api';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'lib-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css'],
})
export class ReviewListComponent implements OnInit, OnDestroy {
  reviews: IReview[] = [];
  subscription: Subscription | undefined = undefined;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading = false;

  constructor(private reviewService: ReviewService, private router: Router) {}

  ngOnInit(): void {
    this.fetchReviews();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  fetchReviews(): void {
    this.loading = true;
    this.subscription = this.reviewService.list().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.successMessage = 'Reviews loaded successfully!';
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load reviews.';
        console.error('Error fetching reviews:', error);
        this.loading = false;
      },
    });
  }

  goToReviewDetail(reviewId: string): void {
    console.log(reviewId);
    this.router.navigate(['/reviews/details', reviewId]);
  }

  deleteReview(id: string, event: Event): void {
    event.stopPropagation(); // Prevent triggering the click event for the parent element
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Review deleted successfully!';
          this.fetchReviews();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete review.';
          console.error('Error deleting review:', error);
        },
      });
    }
  }
}
