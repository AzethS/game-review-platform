import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IEvent } from '@AthleteXperience/shared/api';
import { Injectable } from '@angular/core';
import { environment } from '@AthleteXperience/shared/util-env';

/**
 * See https://angular.io/guide/http#requesting-data-from-a-server
 */
const httpOptions = {
    observe: 'body',
    responseType: 'json',
};

/**
 *
 *
 */
@Injectable()
export class EventService {
    apiUrl = environment.dataApiUrl;
    endpoint = '/api/event';

    constructor(private readonly http: HttpClient) {}

    public list(options?: any): Observable<IEvent[] | null> {
        console.log(`list ${this.endpoint}`);

        return this.http
            .get<ApiResponse<IEvent[]>>(`${this.apiUrl}${this.endpoint}`, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IEvent[]),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    public read(id: string | null, options?: any): Observable<IEvent> {
        console.log(`read ${this.endpoint}/${id}`);
        return this.http
            .get<ApiResponse<IEvent>>(`${this.apiUrl}${this.endpoint}/${id}`, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map(response => response.results as IEvent),
                catchError(this.handleError)
            );
    }

    public create(eventData: any, options?: any): Observable<IEvent> {
        return this.http.post<IEvent>(`${this.apiUrl}${this.endpoint}`, eventData, {
            ...options,
            ...httpOptions,
        }).pipe(
            tap(() => console.log(`New event created`)),
            catchError(this.handleError)
        );
    }

    public update(eventId: string, eventData: any, options?: any): Observable<any> {
        return this.http.put<IEvent>(`${this.apiUrl}${this.endpoint}/${eventId}`, eventData, {
            ...options,
            ...httpOptions
        }).pipe(
            tap(() => console.log(`Updated event with id: ${eventId}`)),
            catchError(this.handleError)
        );
    }

    public delete(id: string, options?: any): Observable<any> {
        return this.http.delete(`${this.apiUrl}${this.endpoint}/${id}`, {
            ...options,
            ...httpOptions,
        }).pipe(
            tap(() => console.log(`Deleted event with id: ${id}`)),
            catchError(this.handleError)
        );
    }

    public getEventsByDateRange(startDate: Date, endDate: Date): Observable<IEvent[]> {
        const params = { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
        return this.http.get<IEvent[]>(`${this.apiUrl}${this.endpoint}/date-range`, { params }).pipe(
          catchError(this.handleError)
        );
    }
    
    public getEventsByType(eventType: string): Observable<IEvent[]> {
        return this.http.get<IEvent[]>(`${this.apiUrl}${this.endpoint}/type/${eventType}`).pipe(
          catchError(this.handleError)
        );
    }
    
    public searchEvents(searchQuery: string): Observable<IEvent[]> {
        return this.http.get<IEvent[]>(`${this.apiUrl}${this.endpoint}/search`, { params: { query: searchQuery } }).pipe(
          catchError(this.handleError)
        );
    }
    
    public getUpcomingEvents(): Observable<IEvent[]> {
        return this.http.get<IEvent[]>(`${this.apiUrl}${this.endpoint}/upcoming`).pipe(
          catchError(this.handleError)
        );
    }
    
    public getPastEvents(): Observable<IEvent[]> {
        return this.http.get<IEvent[]>(`${this.apiUrl}${this.endpoint}/past`).pipe(
          catchError(this.handleError)
        );
    }
    
    public getEventsBySportClub(sportClubId: string): Observable<IEvent[]> {
        return this.http.get<IEvent[]>(`${this.apiUrl}${this.endpoint}/sportclub/${sportClubId}`).pipe(
          catchError(this.handleError)
        );
    }
    
    public addRegistration(eventId: string, userId: string): Observable<IEvent> {
        return this.http.post<IEvent>(`${this.apiUrl}${this.endpoint}/${eventId}/register`, { userId }).pipe(
          catchError(this.handleError)
        );
    }
    
    public removeRegistration(eventId: string, userId: string): Observable<IEvent> {
        return this.http.delete<IEvent>(`${this.apiUrl}${this.endpoint}/${eventId}/unregister/${userId}`).pipe(
          catchError(this.handleError)
        );
    }
    
    public getEventRegistrations(eventId: string): Observable<IEvent> {
        return this.http.get<IEvent>(`${this.apiUrl}${this.endpoint}/${eventId}/registrations`).pipe(
          catchError(this.handleError)
        );
    }
    
    public getUserRegistrations(userId: string): Observable<IEvent[]> {
        return this.http.get<IEvent[]>(`${this.apiUrl}${this.endpoint}/registrations/user/${userId}`).pipe(
          catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in EventService', error);
        return throwError(() => new Error(error.message));
    }
}
