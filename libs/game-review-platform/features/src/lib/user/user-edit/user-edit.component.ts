import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { IUser, Role } from '@game-platform/shared/api';
import { AuthService } from '../../auth/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  selector: 'lib-game-review-user-edit',
  templateUrl: './user-edit.component.html',
  styles: [],
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  roles = Object.values(Role);
  userId = '';
  currentUser: any;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      emailAddress: new FormControl('', [Validators.required, Validators.email]),
      birthDate: new FormControl('', Validators.required),
      address: new FormGroup({
        street: new FormControl(''),
        city: new FormControl(''),
        state: new FormControl(''),
        zipCode: new FormControl(''),
        country: new FormControl(''),
      }),
      role: new FormControl('', Validators.required),
      preferredSports: new FormControl(''),
      qualifications: new FormControl(''),
      specializations: new FormControl(''),
    });
  }

  get f() {
    return this.userForm.controls;
  }

  ngOnInit(): void {
    try {
      this.currentUser = this.authService.decodeToken();
      if (!this.currentUser) throw new Error('User not authenticated');
    } catch (error) {
      console.error('Error decoding token', error);
      this.router.navigate(['/unauthorized']);
      return;
    }

    this.userId = this.route.snapshot.paramMap.get('id')!;
    if (this.userId && this.canEdit(this.userId)) {
      this.userService.read(this.userId).subscribe({
        next: (userData) => this.populateForm(userData),
        error: (err) => {
          this.errorMessage = 'Failed to load user data';
          console.error(err);
        },
      });
    } else {
      this.router.navigate(['/unauthorized']);
    }
  }

  private populateForm(userData: any): void {
    this.userForm.patchValue({
      name: userData.name || '',
      emailAddress: userData.emailAddress || '',
      birthDate: userData.birthDate || '',
      address: {
        street: userData.address?.street || '',
        city: userData.address?.city || '',
        state: userData.address?.state || '',
        zipCode: userData.address?.zipCode || '',
        country: userData.address?.country || '',
      },
      role: userData.role || '',
      preferredSports: userData.preferredSports || '',
      qualifications: userData.qualifications || '',
      specializations: userData.specializations || '',
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      if (this.userId && this.canEdit(this.userId)) {
        this.userService.update(this.userId, this.userForm.value).subscribe({
          next: () => {
            this.successMessage = 'User updated successfully!';
            this.router.navigate([`/users/details/${this.userId}`]);
          },
          error: (err) => {
            this.errorMessage = 'Failed to update user';
            console.error(err);
          },
        });
      } else {
        this.router.navigate(['/unauthorized']);
      }
    }
  }

  resetForm(): void {
    this.userForm.reset();
  }

  canEdit(userId: string): boolean {
    return this.currentUser.role === 'Admin' || userId === this.currentUser.sub;
  }
}
