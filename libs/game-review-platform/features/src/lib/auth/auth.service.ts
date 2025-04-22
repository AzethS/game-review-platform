import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ApiResponse } from '@game-platform/shared/api';
import { environment } from '@game-review-platform/shared/util-env';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.dataApiUrl;
  private readonly endpoint = '/auth/validate';

  readonly token = signal<string | null>(null);
  readonly currentUserSignal = computed(() => {
    const jwt = this.token();
    if (!jwt) return null;
    try {
      return jwtDecode<JwtPayload & { name: string; role: string; id: string }>(
        jwt
      );
    } catch (err) {
      console.error('Error decoding JWT:', err);
      return null;
    }
  });

  readonly isAuthenticated = computed(() => !!this.token());

  constructor(
    private readonly http: HttpClient,
    private readonly cookieService: CookieService,
    private readonly router: Router
  ) {
    // ✅ Initialize the token after cookieService is available
    const storedToken = this.cookieService.get('token');
    if (storedToken) {
      this.token.set(storedToken);
    }
  }

  login(emailAddress: string, password: string) {
    return this.http
      .post<ApiResponse<any>>(`${this.apiUrl}${this.endpoint}`, {
        emailAddress,
        password,
      })
      .pipe(
        tap((response) => {
          const token = response.results.accessToken;
          this.cookieService.set('token', token);
          this.token.set(token); 
        })
      );
  }
  

  logout(): void {
    this.cookieService.delete('token');
    this.token.set(null);
    this.router.navigate(['/login']);
  }

  register(payload: any) {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/auth/register`,
      payload
    );
  }

  decodeToken(token?: string): any {
    try {
      const jwt = token || this.cookieService.get('token');
      if (!jwt) return null;
      return jwtDecode<JwtPayload & { name: string; role: string; id: string }>(
        jwt
      );
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
