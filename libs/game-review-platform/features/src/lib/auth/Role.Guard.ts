import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const currentUser = this.authService.decodeToken();
    // if (currentUser && currentUser.role === next.data['role']) {
    //   return true;
    // }

    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    const roles = next.data['role'] as Array<string>;
    if (roles && roles.includes(currentUser.role)) {
      return true;
    }

    // Navigate to some other route if the user doesn't have the right role
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
