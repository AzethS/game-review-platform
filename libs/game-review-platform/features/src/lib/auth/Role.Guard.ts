import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { JwtPayload } from 'jwt-decode';

interface MyJwtPayload extends JwtPayload {
  id: string;
  role: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class RoleGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.authService.currentUserSignal(); // signal call

    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    const roles = next.data['role'] as string[]; // data.role = ['Admin', 'Member']
    if (roles && roles.includes((currentUser as MyJwtPayload).role)) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}
