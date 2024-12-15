import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../event.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'game-review-event-create',
  templateUrl: './event-create.component.html',
  styles: []
})
export class EventCreateComponent {
  eventForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    capacity: new FormControl('', [Validators.required, Validators.min(1)]),
    eventType: new FormControl('', Validators.required),
    registrationDeadline: new FormControl('', Validators.required),
  });

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private eventService: EventService, private router: Router,
    private authService: AuthService, ) {}

  get f() { return this.eventForm.controls; }

  resetForm() {
    this.eventForm.reset({
      name: '',
      location: '',
      description: '',
      startDate: '',
      endDate: '',
      capacity: '',
      eventType: '',
      registrationDeadline: '',
    });
    this.eventForm.markAsPristine();
    this.eventForm.markAsUntouched();
  }
  
  onSubmit() {
    if (this.eventForm.valid) {

      const startDate = new Date(this.eventForm.value.startDate ?? '');
      const endDate = new Date(this.eventForm.value.endDate ?? '');
      const registrationDeadline = new Date(this.eventForm.value.registrationDeadline ?? '');


      if (registrationDeadline >= endDate) {
        this.errorMessage = 'Registration deadline must be before the end date';
        return;
      }

      const currentUser = this.authService.decodeToken();
      if (!currentUser) {
        this.errorMessage = 'Author ID not found';
        return;
      }

      const formData = {
        ...this.eventForm.value,
        authorId: currentUser.sub,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        registrationDeadline: new Date(registrationDeadline).toISOString(),
      };
      this.eventService.create(formData).subscribe(
        () => {
          this.successMessage = 'Event created successfully!';
          this.resetForm();
          this.router.navigate(['/Events']);
        },
        (error) => {
          this.errorMessage = 'Error creating event';
          console.error('Error:', error);
        }
      );
    }
  }
}
