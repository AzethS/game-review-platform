import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IUser } from '@game-platform/shared/api';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { environment } from '@game-review-platform/shared/util-env';
import { JwtPayload, jwtDecode } from 'jwt-decode';

const httpOptions = {
  observe: 'body',
  responseType: 'json',
};
@Injectable({
    providedIn: 'root'
  })
export class AuthService {

    apiUrl = environment.dataApiUrl;
    // 'http://localhost:3000';
    endpoint = '/api/auth/validate';
    redirectUrl: string | null = null;

    constructor(private readonly http: HttpClient, private cookieService: CookieService,
       private router: Router) {}

    login(emailAddress: string, password: string): Observable<any> {
      // this.http.post<ApiResponse<any>>(`${this.apiUrl}${this.endpoint}`, { emailAddress, password })
      //   .subscribe(response => {
      //     this.cookieService.set('token', response.results.token);

          // this.authService.isLoggedIn();

          // Navigate to a different route if needed
          
          // this.router.navigate(['/auth']);
        // });


      return this.http.post<ApiResponse<any>>(`${this.apiUrl}${this.endpoint}`, { emailAddress, password }).pipe(
        tap(response => 
          this.cookieService.set('token', response.results.accessToken))
      );
    }

    isAuthenticated(): boolean {
      return !!this.cookieService.get('token');
    }

    decodeToken(): any {
      try {
        const token = this.cookieService.get('token');
        if (!token) return null;
  
        const decodedToken = jwtDecode<JwtPayload>(token);
        return decodedToken;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    
}
