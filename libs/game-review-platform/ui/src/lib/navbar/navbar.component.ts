import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ThemeService } from '../theme/theme.service';
import { Router } from '@angular/router';
import { AuthService } from '@fairys-nx-workshop/features';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'lib-game-review-navbar',
  templateUrl: './navbar.component.html',
  styles: [],
})
export class NavbarComponent implements OnInit {
  profilePicture?: string;
  currentUser: any;
  isMenuOpen = false;

  constructor(
    private cookieService: CookieService,
    public themeService: ThemeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profilePicture = 'assets/profile-picture.png';
    this.currentUser = this.authService.decodeToken();
  }

  logout(): void {
    this.cookieService.delete('token');
    this.router.navigate(['/login']); // Redirect to login page after logout
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  isAuth(): boolean {
    return this.authService.isAuthenticated();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
