// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ReviewService } from '../review.service';
// import { IReview } from '@game-platform/shared/api';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { ReactiveFormsModule } from '@angular/forms';

// @Component({
//   imports: [CommonModule, RouterModule, ReactiveFormsModule],
//   selector: 'lib-review-edit',
//   templateUrl: './review-edit.component.html',
// })
// export class ReviewEditComponent implements OnInit {
//   reviewForm = new FormGroup({
//     userId: new FormControl<string>('', Validators.required),
//     gameId: new FormControl<string>('', Validators.required),
//     rating: new FormControl<number | null>(null, [Validators.required, Validators.min(0), Validators.max(5)]),
//     comment: new FormControl<string | null>(null, [Validators.maxLength(500)]),
//   });

//   reviewId!: string;
//   loading = false;
//   successMessage: string | null = null;
//   errorMessage: string | null = null;

//   constructor(
//     private reviewService: ReviewService,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.reviewId = this.route.snapshot.paramMap.get('id')!;
//     if (this.reviewId) {
//       this.loadReview();
//     }
//   }

//   loadReview(): void {
//     this.loading = true;
//     this.reviewService.read(this.reviewId).subscribe({
//       next: (review: IReview) => {
//         this.reviewForm.patchValue({
//           userId: review.userId,
//           gameId: review.gameId,
//           rating: review.rating,
//           comment: review.comment,
//         });
//         this.loading = false;
//       },
//       error: (error) => {
//         this.errorMessage = 'Failed to load the review.';
//         console.error('Load review error:', error);
//         this.loading = false;
//       },
//     });
//   }

//   onSubmit(): void {
//     if (this.reviewForm.valid) {
//       this.loading = true;

//       // Sanitize form values
//       const sanitizedData = this.sanitizeFormValues(this.reviewForm.value);

//       this.reviewService.update(this.reviewId, sanitizedData).subscribe({
//         next: () => {
//           this.successMessage = 'Review updated successfully!';
//           this.loading = false;
//           this.router.navigate(['/reviews']);
//         },
//         error: (error) => {
//           this.errorMessage = 'Failed to update the review.';
//           console.error('Update review error:', error);
//           this.loading = false;
//         },
//       });
//     }
//   }

//   // Helper to sanitize form values
//   private sanitizeFormValues(formValues: any): Partial<IReview> {
//     return {
//       userId: formValues.userId || undefined,
//       gameId: formValues.gameId || undefined,
//       rating: formValues.rating !== null ? formValues.rating : undefined,
//       comment: formValues.comment || undefined,
//     };
//   }
// }
