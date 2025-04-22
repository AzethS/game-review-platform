import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../game.service';
import { IGame } from '@game-platform/shared/api';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';
import { ReviewCreateComponent } from '../../review/review-create/review-create.component';

@Component({
  selector: 'lib-game-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReviewCreateComponent],
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css'],
})
export class GameDetailComponent implements OnInit {
  hasUserReviewed = false;
  fullUser: any = null;
  game: IGame | null = null;
  errorMessage: string | null = null;
  loading = false;
  averageRating: number | null = null;

  auth = inject(AuthService);
  userService = inject(UserService);

  get isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  get currentUser() {
    return this.auth.currentUserSignal();
  }

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.fetchGame(id);

    const userId = this.auth.currentUserSignal()?.id;
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.fullUser = user;
          this.checkUserReviewed();
        },
        error: (err) => console.error('User fetch failed', err),
      });
    }
  }

  fetchGame(id: string): void {
    this.loading = true;
    this.gameService.read(id).subscribe({
      next: (game) => {
        this.game = game;
        this.calculateAverageRating();
        this.checkUserReviewed();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load game.';
        console.error(err);
        this.loading = false;
      },
    });
  }

  private calculateAverageRating(): void {
    if (this.game?.reviews?.length) {
      const total = this.game.reviews.reduce((sum, r) => sum + r.rating, 0);
      this.averageRating = total / this.game.reviews.length;
    } else {
      this.averageRating = null;
    }
  }

  private checkUserReviewed(): void {
    if (!this.fullUser?.id || !this.game?.reviews?.length) {
      this.hasUserReviewed = false;
      return;
    }

    this.hasUserReviewed = this.game.reviews.some(
      (r: any) => r.userId?.id === this.fullUser.id
    );
  }

  get isGameOwned(): boolean {
    return (
      this.fullUser?.ownedGames?.some((g: any) => g.id === this.game?.id) ??
      false
    );
  }

  onReviewSubmitted(): void {
    if (this.game?.id) this.fetchGame(this.game.id);
  }

  addToOwned(): void {
    if (!this.game?.id || !this.fullUser?.id) {
      console.warn('[WARN] Missing game ID or user ID', {
        gameId: this.game?.id,
        userId: this.fullUser?.id,
      });
      return;
    }

    this.userService.addOwnedGame(this.fullUser.id, this.game.id).subscribe({
      next: () => {
        alert('Game added to your library!');
      },
      error: (err) => {
        console.error('[ERROR] Failed to add to owned:', err);
      },
    });
  }
}
