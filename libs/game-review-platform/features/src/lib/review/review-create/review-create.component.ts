import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReviewService } from '../review.service';
import { Router } from '@angular/router';
import { ICreateReview } from '@game-platform/shared/api';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  selector: 'lib-review-create',
  templateUrl: './review-create.component.html',
})
export class ReviewCreateComponent {
  reviewForm = new FormGroup({
    userId: new FormControl<string>('', Validators.required),
    gameId: new FormControl<string>('', Validators.required),
    rating: new FormControl<number | null>(null, [Validators.required, Validators.min(0), Validators.max(5)]),
    comment: new FormControl<string | null>(null, [Validators.maxLength(500)]),
  });

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private reviewService: ReviewService, private router: Router) {}

  onSubmit(): void {
    if (this.reviewForm.valid) {
      const reviewData: ICreateReview = {
        userId: this.reviewForm.value.userId!,
        gameId: this.reviewForm.value.gameId!,
        rating: this.reviewForm.value.rating!,
        comment: this.reviewForm.value.comment || undefined,
      };

      this.reviewService.create(reviewData).subscribe({
        next: () => {
          this.successMessage = 'Review created successfully!';
          this.router.navigate(['/reviews']);
        },
        error: (err) => {
          this.errorMessage = 'Error creating review';
          console.error(err);
        },
      });
    }
  }
}
