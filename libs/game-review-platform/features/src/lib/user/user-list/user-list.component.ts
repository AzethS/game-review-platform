import { IUser } from '@game-platform/shared/api';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Id } from '@game-platform/shared/api';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Role } from '@game-platform/shared/api';

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'lib-game-review-user-list',
  templateUrl: './user-list.component.html',
  styles: [],
})
export class UserListComponent implements OnInit, OnDestroy {
  Role = Role;
  users: IUser[] | null = null;
  subscription: Subscription | undefined = undefined;

  getRandomNumber(index: number): number {
    return (index * 7 + 5) % 99; // Simple hash to make it stable
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/fallback-user.png'; // Replace with your actual fallback image path
  }
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.subscription = this.userService.list().subscribe((results) => {
      console.log(`results: ${results}`);
      this.users = results;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  goToUserDetail(userId: Id): void {
    console.log(userId);
    this.router.navigate(['/users/details', userId]);
  }
}
