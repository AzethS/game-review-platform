// import { Component, OnInit } from '@angular/core';
// import { ReviewService } from '../review/review.service';
// import { UserService } from '../user/user.service';
// import { GameService } from '../game/game.service';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// @Component({
//   imports: [CommonModule, RouterModule],
//   selector: 'lib-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css'],
// })
// export class DashboardComponent implements OnInit {
//   reviewsCount = 0;
//   usersCount = 0;
//   gamesCount = 0;
//   loading = true;
//   errorMessage: string | null = null;

//   constructor(
//     private reviewService: ReviewService,
//     private userService: UserService,
//     private gameService: GameService
//   ) {}

//   ngOnInit(): void {
//     this.loadDashboardData();
//   }

//   private loadDashboardData(): void {
//     this.loading = true;

//     Promise.all([
//       this.reviewService.list().toPromise(),
//       this.userService.list().toPromise(),
//       this.gameService.list().toPromise(),
//     ])
//       .then(([reviews, users, games]) => {
//         this.reviewsCount = reviews?.length || 0;
//         this.usersCount = users?.length || 0;
//         this.gamesCount = games?.length || 0;
//         this.loading = false;
//       })
//       .catch((error) => {
//         console.error('Error loading dashboard data:', error);
//         this.errorMessage = 'Failed to load dashboard data';
//         this.loading = false;
//       });
//   }
// }
