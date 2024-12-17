import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { IUser } from '@game-platform/shared/api';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'lib-game-review-user-details',
  templateUrl: './user-details.component.html',
  styles: [],
})
export class UserDetailsComponent implements OnInit {
  userId!: string;
  user: IUser | null = null;
  currentUser: any;

  constructor(private route: ActivatedRoute, private userService: UserService,
    private router: Router, private authService: AuthService ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.decodeToken();
    this.userId = this.route.snapshot.paramMap.get('id')!;
    console.log(this.canNavigate(this.userId))
      if (this.userId && this.canNavigate(this.userId)) {
        this.userService.read(this.userId).subscribe(
          (userData) => {
              this.user = userData;
          },
          (error) => {
            console.error('Error fetching user details:', error);
          }
        );
      } else {
        this.router.navigate(['/unauthorized']);
      }
  }

  public deleteUser(userId: string): void {
    if(confirm('Are you sure you want to delete this user?')) {
      if (this.canDelete()) {
      this.userService.delete(userId).subscribe(
        () => {
          console.log('User deleted successfully');
          this.router.navigate(['/Users']);
        },
        (error: any) => {
          console.error('Error deleting user:', error);
        }
      );
      } else {
        this.router.navigate(['/unauthorized']);      
      }
    }
  }

  canNavigate(userId: string): boolean {
    return this.currentUser.role === 'Admin' || userId === this.currentUser.sub;
  }

  canDelete(): boolean {
    return this.currentUser.role === 'Admin';
  }
}
