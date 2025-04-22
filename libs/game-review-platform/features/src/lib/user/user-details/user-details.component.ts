// user-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IGame, IUser } from '@game-platform/shared/api';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { Role } from '@game-platform/shared/api';

@Component({
  selector: 'lib-user-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent implements OnInit {
  Role = Role;
  recommendedGames: IGame[] = [];
  user: IUser | null = null;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) 
      this.fetchUser(userId);
    
  }

  fetchUser(id: string) {
    this.loading = true;
    this.userService.read(id).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
  
        this.userService.getRecommendGamesForUser(user.id).subscribe({
          next: (games) => {
            this.recommendedGames = games;
            console.log('[RCMD] Recommended games:', games);
          },
          error: (err: any) => {
            console.error('[RCMD] Failed to fetch recommendations', err);
          },
        });
      },
      error: (err) => {
        this.errorMessage = 'Failed to load user.';
        this.loading = false;
        console.error(err);
      },
    });
  }
  
}
