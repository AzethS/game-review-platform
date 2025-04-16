import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../user.service';
import { Role } from '@game-platform/shared/api';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  selector: 'lib-game-review-user-create',
  templateUrl: './user-create.component.html',
  styles: [],
})
export class UserCreateComponent implements OnInit {
  currentUser: any;

  userForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  roles = Object.values(Role);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: [''],
      }),
      role: ['', Validators.required],
      reviewsGiven: [[]],
      ownedGames: [[]],
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.decodeToken();
  }

  get f() {
    return this.userForm.controls;
  }

  resetForm() {
    this.userForm.reset();
  }

  onSubmit() {
    if (this.canCreate()) {
      if (this.userForm.valid) {
        this.userService.create(this.userForm.value).subscribe(
          (response: any) => {
            this.successMessage = 'User created successfully!';
            console.log('User created:', response);
            this.resetForm();
            this.router.navigate(['/Users']);
          },
          (error: any) => {
            this.errorMessage = 'Error creating user';
            console.error('Error creating user:', error);
          }
        );
      }
    } else {
      this.router.navigate(['/unauthorized']);
    }
  }

  canCreate(): boolean {
    return this.currentUser.role === 'Admin';
  }
}
