import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'game-review-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent {

  successMessage!: string | null;
  errorMessage!: string | null;
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe(() => {
      console.log('Successfully logged in');
      this.successMessage = 'Member updated successfully';
      if (this.authService.redirectUrl) {
        this.router.navigateByUrl(this.authService.redirectUrl);
        this.authService.redirectUrl = null;
      } else {
      this.router.navigate(['/']);
      }
    },
    error => {
      // Handle error
      this.errorMessage = 'Email Address or Password is not correct';
      console.log('Error logging in', error);
    });
  }
}
