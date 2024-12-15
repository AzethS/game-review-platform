import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from '../event.service';
import { IEvent, Id } from '@AthleteXperience/shared/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'athlete-xperience-event-list',
  templateUrl: './event-list.component.html',
  styles: [],
})
export class EventListComponent implements OnInit, OnDestroy {
  events: IEvent[] | null = null;
  subscription: Subscription | undefined;
  currentUser: any;

  constructor(private eventService: EventService, private router: Router,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.decodeToken();
    this.subscription = this.eventService.list().subscribe((results) => {
      this.events = results;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  goToEventDetail(eventId: Id): void {
    this.router.navigate(['/Events', eventId]);
  }
}
