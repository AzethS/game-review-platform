import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private cookieService: CookieService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isAuthenticated = this.cookieService.check('token');

    if (!isAuthenticated) {
      // optionally store intended URL
      localStorage.setItem('redirectUrl', state.url);

      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
