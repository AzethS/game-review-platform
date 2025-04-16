import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IUser } from '@game-platform/shared/api';
import { Injectable } from '@angular/core';
import { environment } from '@game-review-platform/shared/util-env';

/**
 * See https://angular.io/guide/http#requesting-data-from-a-server
 */
import { HttpHeaders } from '@angular/common/http';

export const httpOptions = {
  headers: new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token')}`, // Replace with your token storage mechanism
  }),
  observe: 'body' as const,
  responseType: 'json' as const,
};


/**
 *
 *
 */
@Injectable({
    providedIn: 'root', // This makes the service available application-wide
})
export class UserService {
    apiUrl = environment.dataApiUrl;
    endpoint = '/user';

    constructor(private readonly http: HttpClient) {}

    /**
     * Get all items.
     *
     * @options options - optional URL queryparam options
     */
    public list(options?: any): Observable<IUser[] | null> {
        console.log(`list ${this.endpoint}`);

        return this.http
            .get<ApiResponse<IUser[]>>(this.apiUrl+this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IUser[]),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    /**
     * Get a single item from the service.
     *
     */
    public read(id: string | null, options?: any): Observable<IUser> {
        console.log(`read ${this.endpoint}/${id}`);
        return this.http
            .get<ApiResponse<IUser>>(`${this.apiUrl}${this.endpoint}/${id}`, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IUser),
                catchError(this.handleError)
            );
    }


    public delete(id: string,  options?: any): Observable<any> {
        return this.http.delete(`${this.apiUrl}${this.endpoint}/${id}`, {
            ...options,
            ...httpOptions,
        }).pipe(
          tap(() => console.log(`Deleted user with id: ${id}`)),
          catchError(this.handleError)
        );
    }


    public create(userData: any,  options?: any): Observable<IUser> {
        return this.http.post<IUser>(this.apiUrl+this.endpoint, userData, {
            ...options,
            ...httpOptions,
        }).pipe(
        tap(() => console.log(`New user Created`)),
          catchError(this.handleError)
        );
      }


    public update(userId: string, userData: any, options?: any): Observable<any> {
        return this.http.put<IUser>(`${this.apiUrl}${this.endpoint}/${userId}`, userData, {
            ...options,
            ...httpOptions
            }).pipe(
            tap(() => console.log(`Updated user with id: ${userId}`)),
            catchError(this.handleError)
        );
    }

    getMembers(options?: any): Observable<IUser[] | null> {
        return this.http.get<ApiResponse<IUser[]>>(`${this.apiUrl}${this.endpoint}/members`, {
            ...options,
            ...httpOptions,
        })
        .pipe(
            map((response: any) => response.results as IUser[]),
            tap(console.log),
            catchError(this.handleError)
        );
    }


    /**
     * Handle errors.
     */
    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in UserService', error);

        return throwError(() => new Error(error.message));
    }
}
