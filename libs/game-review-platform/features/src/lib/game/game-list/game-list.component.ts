import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { IGame } from '@game-platform/shared/api';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'lib-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css'],
})
export class GameListComponent implements OnInit {
  games: IGame[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading = false;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.fetchGames();
  }

  fetchGames(): void {
    this.loading = true;
    this.gameService.list().subscribe({
      next: (games) => {
        this.games = games;
        this.successMessage = 'Games loaded successfully!';
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load games.';
        console.error('Error fetching games:', error);
        this.loading = false;
      },
    });
  }

  deleteGame(id: string): void {
    if (confirm('Are you sure you want to delete this game?')) {
      this.gameService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Game deleted successfully!';
          this.fetchGames();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete game.';
          console.error('Error deleting game:', error);
        },
      });
    }
  }
}
