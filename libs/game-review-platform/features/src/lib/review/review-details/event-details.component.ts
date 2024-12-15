import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../event.service';
import { IEvent } from '@AthleteXperience/shared/api';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'athlete-xperience-event-details',
  templateUrl: './event-details.component.html',
  styles: [],
})
export class EventDetailsComponent implements OnInit {
  eventId!: string;
  event: IEvent | null = null;
  currentUser: any;


  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.decodeToken();
    this.eventId = this.route.snapshot.paramMap.get('id')!;
    if (this.eventId) {
      this.eventService.read(this.eventId).subscribe(
        (event) => {
          this.event = event;
          // this.getEventRegistrations();
        },
        (error) => {
          console.error('Error fetching event details:', error);
        }
      );
    }
  }

  // private getEventRegistrations(): void {
  //   if (this.eventId) {
  //     this.eventService.getEventRegistrations(this.eventId).subscribe(
  //       eventData => {
  //         if (eventData && eventData.id) {
  //           this.event = { ...this.event, registrations: eventData.registrations };
  //         } else {
  //           console.error('Received eventData is missing required fields');
  //         }
  //         console.log(this.event);
  //     },
  //     error => console.error('Error fetching event registrations:', error)
  //   );
  //   }
  // }

  public deleteEvent(eventId: string): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.delete(eventId).subscribe(
        () => {
          console.log('Event deleted successfully');
          this.router.navigate(['/Events']);
        },
        (error) => {
          console.error('Error deleting event:', error);
        }
      );
    }
  }
}
