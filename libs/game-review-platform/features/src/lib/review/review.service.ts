import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { IReview, ApiResponse } from '@game-platform/shared/api';
import { environment } from '@game-review-platform/shared/util-env';

@Injectable({
  providedIn: 'root', // This makes the service available application-wide

})
export class ReviewService {
  
  private readonly apiUrl = environment.dataApiUrl;
  private readonly endpoint = '/reviews';

  constructor(private readonly http: HttpClient) {}

  /**
   * Get all reviews.
   */
  public list(): Observable<IReview[]> {
    return this.http
      .get<ApiResponse<IReview[]>>(`${this.apiUrl}${this.endpoint}`)
      .pipe(
        map((response) => {
          if (!response || !response.results) {
            console.error('Invalid response format', response);
            return [];
          }
          return response.results as IReview[];
        }),
        tap(() => console.log('Fetched all reviews')),
        catchError(this.handleError)
      );
  }

  /**
   * Get a single review by ID.
   */
  public read(reviewId: string): Observable<IReview> {
    return this.http
      .get<ApiResponse<IReview>>(`${this.apiUrl}${this.endpoint}/${reviewId}`)
      .pipe(
        map((response) => {
          if (!response || !response.results) {
            console.error(`Invalid response format for review ID: ${reviewId}`, response);
            throw new Error('Review not found');
          }
          return response.results as IReview;
        }),
        tap(() => console.log(`Fetched review with ID: ${reviewId}`)),
        catchError(this.handleError)
      );
  }

  /**
   * Get reviews by user ID.
   */
  public getByUser(userId: string): Observable<IReview[]> {
    return this.http
      .get<ApiResponse<IReview[]>>(`${this.apiUrl}${this.endpoint}/user/${userId}`)
      .pipe(
        map((response) => {
          if (!response || !response.results) {
            console.error(`Invalid response format for user ID: ${userId}`, response);
            return [];
          }
          return response.results as IReview[];
        }),
        tap(() => console.log(`Fetched reviews for user ID: ${userId}`)),
        catchError(this.handleError)
      );
  }

  /**
   * Get reviews by game ID.
   */
  public getByGame(gameId: string): Observable<IReview[]> {
    return this.http
      .get<ApiResponse<IReview[]>>(`${this.apiUrl}${this.endpoint}/game/${gameId}`)
      .pipe(
        map((response) => {
          if (!response || !response.results) {
            console.error(`Invalid response format for game ID: ${gameId}`, response);
            return [];
          }
          return response.results as IReview[];
        }),
        tap(() => console.log(`Fetched reviews for game ID: ${gameId}`)),
        catchError(this.handleError)
      );
  }

  /**
   * Create a new review.
   */
  public create(reviewData: Partial<IReview>): Observable<IReview> {
    return this.http
      .post<ApiResponse<IReview>>(`${this.apiUrl}${this.endpoint}`, reviewData)
      .pipe(
        map((response) => {
          if (!response || !response.results) {
            console.error('Invalid response format during review creation', response);
            throw new Error('Failed to create review');
          }
          return response.results as IReview;
        }),
        tap(() => console.log('Created a new review')),
        catchError(this.handleError)
      );
  }

  /**
   * Update a review by ID.
   */
  public update(reviewId: string, reviewData: Partial<IReview>): Observable<IReview> {
    return this.http
      .put<ApiResponse<IReview>>(`${this.apiUrl}${this.endpoint}/${reviewId}`, reviewData)
      .pipe(
        map((response) => {
          if (!response || !response.results) {
            console.error(`Invalid response format during update for review ID: ${reviewId}`, response);
            throw new Error('Failed to update review');
          }
          return response.results as IReview;
        }),
        tap(() => console.log(`Updated review with ID: ${reviewId}`)),
        catchError(this.handleError)
      );
  }

/**
 * Delete a review by ID.
 */
public delete(reviewId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}${this.endpoint}/${reviewId}`, {
        observe: 'body',
        responseType: 'json',
      })
      .pipe(
        tap(() => console.log(`Deleted review with ID: ${reviewId}`)),
        catchError(this.handleError)
      );
  }
  

  /**
   * Handle errors from the API.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('ReviewService Error:', error);
    return throwError(() => new Error(error.message));
  }
}
