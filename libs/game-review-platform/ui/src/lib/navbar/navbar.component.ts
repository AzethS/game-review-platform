import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../theme/theme.service';
import { Router } from '@angular/router';
import { AuthService } from '@fairys-nx-workshop/features';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'lib-game-review-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styles: [],
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);

  profilePicture = 'assets/profile-picture.png';
  currentUser = this.authService.currentUserSignal;
  isAuth = this.authService.isAuthenticated;
  isMenuOpen = false;

  logout(): void {
    this.authService.logout();
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
