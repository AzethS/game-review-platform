import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { IGame, ApiResponse } from '@game-platform/shared/api';
import { environment } from '@game-review-platform/shared/util-env';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly apiUrl = environment.dataApiUrl;
  private readonly endpoint = '/games';

  constructor(private readonly http: HttpClient) {}

  /**
   * Get all games.
   */
  public list(): Observable<IGame[]> {
    return this.http
      .get<ApiResponse<IGame[]>>(`${this.apiUrl}${this.endpoint}`)
      .pipe(
        map((response) => {
          if (!response || !response.results) {
            console.error('Invalid response format', response);
            return [];
          }
          return response.results as IGame[];
        }),
        tap(() => console.log('Fetched all games')),
        catchError(this.handleError)
      );
  }

  /**
   * Get a single game by ID.
   */
  public read(gameId: string): Observable<IGame> {
    return this.http
      .get<ApiResponse<IGame>>(`${this.apiUrl}${this.endpoint}/${gameId}`)
      .pipe(
        map((response) => {
          if (!response || !response.results) {
            console.error(`Invalid response format for game ID: ${gameId}`, response);
            throw new Error('Game not found');
          }
          return response.results as IGame;
        }),
        tap(() => console.log(`Fetched game with ID: ${gameId}`)),
        catchError(this.handleError)
      );
  }

  /**
   * Get games by platform ID.
   */
  public getByPlatform(platformId: string): Observable<IGame[]> {
    return this.http
      .get<ApiResponse<IGame[]>>(`${this.apiUrl}${this.endpoint}/platform/${platformId}`)
      .pipe(
        map((response) => {
          if (!response || !response.results) {
            console.error(`Invalid response format for platform ID: ${platformId}`, response);
            return [];
          }
          return response.results as IGame[];
        }),
        tap(() => console.log(`Fetched games for platform ID: ${platformId}`)),
        catchError(this.handleError)
      );
  }

  /**
   * Create a new game.
   */
  public create(gameData: Partial<IGame>): Observable<IGame> {
    return this.http
      .post<ApiResponse<IGame>>(`${this.apiUrl}${this.endpoint}`, gameData)
      .pipe(
        map((response) => {
          if (!response || !response.results) {
            console.error('Invalid response format during game creation', response);
            throw new Error('Failed to create game');
          }
          return response.results as IGame;
        }),
        tap(() => console.log('Created a new game')),
        catchError(this.handleError)
      );
  }

  /**
   * Update a game by ID.
   */
  public update(gameId: string, gameData: Partial<IGame>): Observable<IGame> {
    return this.http
      .put<ApiResponse<IGame>>(`${this.apiUrl}${this.endpoint}/${gameId}`, gameData)
      .pipe(
        map((response) => {
          if (!response || !response.results) {
            console.error(`Invalid response format during update for game ID: ${gameId}`, response);
            throw new Error('Failed to update game');
          }
          return response.results as IGame;
        }),
        tap(() => console.log(`Updated game with ID: ${gameId}`)),
        catchError(this.handleError)
      );
  }

  /**
   * Delete a game by ID.
   */
  public delete(gameId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}${this.endpoint}/${gameId}`)
      .pipe(
        tap(() => console.log(`Deleted game with ID: ${gameId}`)),
        catchError(this.handleError)
      );
  }

  /**
   * Handle errors from the API.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('GameService Error:', error);
    return throwError(() => new Error(error.message));
  }
}
