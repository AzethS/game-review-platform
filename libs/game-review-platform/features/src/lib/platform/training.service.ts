import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, ITraining } from '@AthleteXperience/shared/api';
import { Injectable } from '@angular/core';
import { environment } from '@AthleteXperience/shared/util-env';

/**
 * See https://angular.io/guide/http#requesting-data-from-a-server
 */
export const httpOptions = {
    observe: 'body',
    responseType: 'json',
};

/**
 *
 *
 */
@Injectable()
export class TrainingService {
    apiUrl = environment.dataApiUrl;
    endpoint = '/api/training';

    constructor(private readonly http: HttpClient) {}

    /**
     * Get all items.
     *
     * @options options - optional URL queryparam options
     */
    public list(options?: any): Observable<ITraining[] | null> {
        console.log(`list ${this.apiUrl}${this.endpoint}`);

        return this.http
            .get<ApiResponse<ITraining[]>>(this.apiUrl+this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as ITraining[]),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    /**
     * Get a single item from the service.
     *
     */
    public read(id: string | null, options?: any): Observable<ITraining> {
        console.log(`read ${this.endpoint}/${id}`);
        return this.http
            .get<ApiResponse<ITraining>>(`${this.apiUrl}${this.endpoint}/${id}`, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as ITraining),
                catchError(this.handleError)
            );
    }


    public delete(id: string,  options?: any): Observable<any> {
        return this.http.delete(`${this.apiUrl}${this.endpoint}/${id}`, {
            ...options,
            ...httpOptions,
        }).pipe(
          tap(() => console.log(`Deleted training with id: ${id}`)),
          catchError(this.handleError)
        );
    }


    public create(trainingData: any,  options?: any): Observable<ITraining> {
        return this.http.post<ITraining>(`${this.apiUrl}${this.endpoint}`, trainingData, {
            ...options,
            ...httpOptions,
        }).pipe(
        tap(() => console.log(`New training Created`)),
          catchError(this.handleError)
        );
      }


    public update(trainingId: string, trainingData: any, options?: any): Observable<any> {
        return this.http.put<ITraining>(`${this.apiUrl}${this.endpoint}/${trainingId}`, trainingData, {
            ...options,
            ...httpOptions
            }).pipe(
            tap(() => console.log(`Updated training with id: ${trainingId}`)),
            catchError(this.handleError)
        );
    }

    registerForTraining(trainingId: string, userId: string, options?: any): Observable<any> {
        const url = `${this.apiUrl}${this.endpoint}/${trainingId}/members/${userId}`;
        return this.http.put<ITraining>(url, {
            ...options,
            ...httpOptions,
        }).pipe(
            tap(() => console.log(`New Registration Added`)),
              catchError(this.handleError)
        );
    }
    
    
    removeRegistration(trainingId: string, userId: string, options?: any): Observable<any> {
        const url = `${this.apiUrl}${this.endpoint}/${trainingId}/memebers/${userId}`;
        return this.http.put<ITraining>(url, {
            ...options,
            ...httpOptions,
        }).pipe(
            tap(() => console.log(`New Registration Removed`)),
              catchError(this.handleError)
        );
    }

    // isRegistered(trainingId: string | null, userId: string | null, options?: any): Observable<any> {
    //     if (!trainingId || !userId) {
    //         console.error('Something is missing');
    //         return of(false);
    //     }

    //     return this.read(trainingId).pipe(
    //             map((training) => {
    //                 if (training && Array.isArray(training.members)) {
    //                     return training.members.includes(userId);
    //                 }
    //                 return false;
    //             }),
    //             catchError((error) => {
    //                 console.error('Error checking user registration:', error);
    //                 return of(false);
    //             })
    //     );
        
    // }
    /**
     * Handle errors.
     */
    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in TrainingService', error);

        return throwError(() => new Error(error.message));
    }
}
