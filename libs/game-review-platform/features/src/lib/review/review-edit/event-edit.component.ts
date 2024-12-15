import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../event.service';
import { IEvent } from '@AthleteXperience/shared/api';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'athlete-xperience-event-edit',
  templateUrl: './event-edit.component.html',
  styles: [],
})
export class EventEditComponent implements OnInit {
  eventForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  eventId!: string;

  currentEventData: IEvent | null = null;
  currentUser: any;


  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.eventForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      capacity: new FormControl('', [Validators.required, Validators.min(1)]),
      eventType: new FormControl('', Validators.required),
      registrationDeadline: new FormControl('', Validators.required),
      // No form control for registrations as they are managed differently
    });
  }

  get f() {
    return this.eventForm.controls;
  }

  ngOnInit(): void {
    this.currentUser = this.authService.decodeToken();
    this.eventId = this.route.snapshot.paramMap.get('id')!;
    if (this.eventId) {
      this.eventService.read(this.eventId).subscribe(eventData => {
        if (this.canEditEvent(eventData)) {
        this.currentEventData = eventData;
        this.eventForm.patchValue(eventData);
        } else {
          this.router.navigate(['/unauthorized']);
        }
      });
    }
  }

  canEditEvent(eventData: IEvent): boolean {
    // Allow editing if the user is an Admin or the author of the event
    return this.currentUser.role === 'Admin' || eventData.authorId === this.currentUser.sub;
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const formData: any = {
        ...this.eventForm.value
      };

      formData.startDate = formData.startDate ? new Date(formData.startDate).toISOString() : this.currentEventData?.startDate;
      formData.endDate = formData.endDate ? new Date(formData.endDate).toISOString() : this.currentEventData?.endDate;
      formData.registrationDeadline = formData.registrationDeadline ? new Date(formData.registrationDeadline).toISOString() : this.currentEventData?.registrationDeadline;

      if (new Date(formData.registrationDeadline) >= new Date(formData.endDate)) {
        this.errorMessage = 'Registration deadline must be before the end date';
        return;
      }

      if (this.eventId) {
        this.eventService.update(this.eventId, formData).subscribe({
          next: (response: IEvent) => {
            this.successMessage = 'Event updated successfully';
            this.router.navigate([`/Events/${this.eventId}`]);
          },
          error: (error: any) => {
            this.errorMessage = 'Error updating event';
          }
        });
      }
    }
  }

  resetForm() {
    this.eventForm.reset();
  }
}