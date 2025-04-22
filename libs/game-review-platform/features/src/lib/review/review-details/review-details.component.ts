// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ReviewService } from '../review.service';
// import { IReview } from '@game-platform/shared/api';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// @Component({
//   imports: [CommonModule, RouterModule],
//   selector: 'lib-review-details',
//   templateUrl: './review-details.component.html',
//   styles: [],
// })
// export class ReviewDetailsComponent implements OnInit {
//   reviewId!: string; // Using definite assignment assertion
//   review!: IReview;
//   loading = false;
//   errorMessage: string | null = null;

//   constructor(
//     private reviewService: ReviewService,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.reviewId = this.route.snapshot.paramMap.get('id') || '';
//     if (this.reviewId) {
//       this.loadReview();
//     } else {
//       this.errorMessage = 'Invalid review ID';
//     }
//   }

//   private loadReview(): void {
//     this.loading = true;
//     this.reviewService.read(this.reviewId).subscribe({
//       next: (data: IReview) => {
//         this.review = data;
//         this.loading = false;
//       },
//       error: (error) => {
//         this.errorMessage = 'Failed to load review details';
//         console.error('Error fetching review details:', error);
//         this.loading = false;
//       },
//     });
//   }

//   goBack(): void {
//     this.router.navigate(['/reviews']);
//   }
// }
