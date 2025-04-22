import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf

@Component({
  selector: 'lib-app-login',
  standalone: true, // Ensure this is marked as a standalone component
  imports: [FormsModule, CommonModule, RouterModule], // Import CommonModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.successMessage = 'Login successful!';
        this.errorMessage = null;

        const userId = res?.results?.user?.id; // Ensure backend sends user object

        if (userId) {
          setTimeout(() => {
            this.router.navigate(['/users/details', userId]); // Redirect to user detail
          });
        } else {
          this.router.navigate(['/']); // Fallback
        }
      },
      error: (error) => {
        this.errorMessage = 'Invalid email or password';
        console.error('Login error:', error);
      },
      complete: () => {
        console.log('Login observable completed');
      },
    });
  }
}
