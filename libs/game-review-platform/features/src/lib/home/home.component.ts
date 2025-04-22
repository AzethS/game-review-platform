// libs/game-review-platform/ui/src/lib/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { GameService } from '../game/game.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lib-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  gamesCount = 0;
  loading = true;
  errorMessage: string | null = null;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.loadGameStats();
  }

  private loadGameStats(): void {
    this.loading = true;
    this.gameService
      .list()
      .toPromise()
      .then((games) => {
        this.gamesCount = games?.length || 0;
        this.loading = false;
      })
      .catch((error) => {
        console.error('Failed to fetch game stats:', error);
        this.errorMessage = 'Unable to load game stats';
        this.loading = false;
      });
  }
}
