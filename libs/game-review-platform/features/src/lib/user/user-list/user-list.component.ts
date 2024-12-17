import { IUser } from '@game-platform/shared/api';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Id } from '@game-platform/shared/api';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'lib-game-review-user-list',
  templateUrl: './user-list.component.html',
  styles: [],
})
export class UserListComponent implements OnInit, OnDestroy {
    users: IUser[] | null = null;
    subscription: Subscription | undefined = undefined;

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
        this.router.navigate(['/Users', userId]); 
    }

    getRandomNumber(): number {
      return Math.floor(Math.random() * 100); // Random number between 0 and 99
    }

}
