import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../review.service';
import { ICreateReview, IGame, IUser } from '@game-platform/shared/api';

@Component({
  selector: 'lib-review-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review-create.component.html',
})
export class ReviewCreateComponent {
  @Input() gameId!: string;
  @Input() userId!: string;
  @Output() reviewCreated = new EventEmitter<void>();

  reviewForm = new FormGroup({
    rating: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(5),
    ]),
    comment: new FormControl<string | null>(null, [Validators.maxLength(500)]),
  });

  constructor(private reviewService: ReviewService) {}

  onSubmit(): void {
    if (!this.gameId || !this.userId) return;

    if (this.reviewForm.valid) {
      const payload: ICreateReview = {
        userId: this.userId as any, // pass plain string ID
        gameId: this.gameId as any, // pass plain string ID
        rating: this.reviewForm.value.rating!,
        comment: this.reviewForm.value.comment ?? '',
      };

      this.reviewService.create(payload).subscribe({
        next: () => {
          this.reviewCreated.emit();
          this.reviewForm.reset();
          this.reviewService.syncNeo4jGames().subscribe({
            next: () => console.log('[SYNC] Neo4j sync successful'),
            error: (err) => console.warn('[SYNC] Neo4j sync failed', err),
          });
        },
        error: (err) => {
          console.error('Failed to create review', err);
        },
      });
    }
  }
}
