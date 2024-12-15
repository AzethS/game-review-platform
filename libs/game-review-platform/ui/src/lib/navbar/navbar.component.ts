import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ThemeService } from '../theme/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'agame-review-navbar',
  templateUrl: './navbar.component.html',
  styles: [],
  // providers: [CookieService],
})
export class NavbarComponent implements OnInit {
  profilePicture?: string
  // cookieService = inject(CookieService);
  currentUser: any;


  constructor(private cookieService: CookieService, public themeService: ThemeService,
    private authService: AuthService, private router: Router,
    private membershipService: MembershipService) {}

  ngOnInit(): void {
    this.profilePicture = "assets/profile-picture.png";
    this.currentUser = this.authService.decodeToken();
    const userId = this.currentUser.sub;
  }

  logout(): void {
    this.cookieService.delete('token');
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  isAuth(): boolean {
    return this.authService.isAuthenticated();
  }

  goToMemberships() {
    if (this.currentUser && this.currentUser.sub) {
      this.router.navigate(['/Membership/Member/', this.currentUser.sub]);
    }
  }
}
