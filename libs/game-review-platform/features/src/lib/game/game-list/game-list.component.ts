import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../game.service';
import { IGame } from '@game-platform/shared/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-game-review-game-list',
  standalone: true, // Standalone component
  imports: [CommonModule], // Include CommonModule for basic Angular directives
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css'],
  providers: [GameService]
})
export class GameListComponent implements OnInit, OnDestroy {
  games: IGame[] | null = null;
  subscription: Subscription | undefined;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.subscription = this.gameService.list().subscribe({
      next: (results) => {
        console.log(`Fetched games: ${results}`);
        this.games = results;
      },
      error: (err) => {
        console.error('Error fetching games:', err);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
