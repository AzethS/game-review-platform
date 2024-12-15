import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IGame } from '@game-platform/shared/api';
import { environment } from '@game-review-platform/shared/util-env';

/**
 * HTTP options for requests
 */
export const httpOptions = {
  observe: 'body' as const,
  responseType: 'json' as const,
};

/**
 * Service to manage games and communicate with the backend
 */
@Injectable()
export class GameService {
  endpoint = `${environment.dataApiUrl}/games`; // Base URL for the game API

  constructor(private readonly http: HttpClient) {}

  /**
   * Get all games.
   *
   * @param options - Optional query parameters
   */
  public list(options?: any): Observable<IGame[] | null> {
    console.log(`Fetching games from ${this.endpoint}`);

    return this.http
      .get<ApiResponse<IGame[]>>(this.endpoint, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        map((response: any) => response.results as IGame[]),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  /**
   * Get a single game by ID.
   *
   * @param id - The ID of the game
   * @param options - Optional query parameters
   */
  public read(id: string | null, options?: any): Observable<IGame> {
    console.log(`Fetching game with ID: ${id} from ${this.endpoint}/${id}`);
    return this.http
      .get<ApiResponse<IGame>>(`${this.endpoint}/${id}`, {
        ...options,
        ...httpOptions,
      })
      .pipe(
        tap(console.log),
        map((response: any) => response.results as IGame),
        catchError(this.handleError)
      );
  }

  /**
   * Handle HTTP errors.
   *
   * @param error - The HTTP error response
   * @returns An Observable that emits an error
   */
  public handleError(error: HttpErrorResponse): Observable<any> {
    console.error('Error occurred in GameService:', error);
    return throwError(() => new Error(error.message));
  }
}
