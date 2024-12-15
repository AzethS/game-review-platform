import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { IUser, Role } from '@Agamereview/shared/api';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'gamereview-user-edit',
  templateUrl: './user-edit.component.html',
  styles: [],
})
export class UserEditComponent implements OnInit {

  userForm: FormGroup;
  successMessage!: string | null;
  errorMessage!: string | null;
  roles = Object.values(Role); // Assuming you have defined roles as enum
  userId!: string;
  currentUser: any;


  constructor(
    private userService: UserService, // Use UserService instead of TrainingService
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      emailAddress: new FormControl('', [Validators.required, Validators.email]),
      birthDate: new FormControl('', Validators.required),
      address: new FormGroup({ // Nested FormGroup for address
        street: new FormControl(''),
        city: new FormControl(''),
        state: new FormControl(''),
        zipCode: new FormControl(''),
        country: new FormControl('')
      }),
      role: new FormControl('', Validators.required),
      preferredSports: new FormControl(''), // Handle as a string or array
      qualifications: new FormControl(''),
      specializations: new FormControl('')
    });
  }
  
  get f() {
    return this.userForm.controls;
  }

  ngOnInit(): void {
    this.currentUser = this.authService.decodeToken();
    this.userId = this.route.snapshot.paramMap.get('id')!;
    if (this.userId && this.canEdit(this.userId)) {
      // Fetch the user data and update the form
      this.userService.read(this.userId).subscribe(userData => {
        this.userForm.patchValue(userData);
      });
    } else {
      this.router.navigate(['/unauthorized']);
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      if (this.userId && this.canEdit(this.userId)) {
        this.userService.update(this.userId, this.userForm.value).subscribe({
          next: (response: any) => {
            this.successMessage = 'User updated successfully';
            console.log('User Edited:', response);
            this.router.navigate([`/Users/${this.userId}`]);
          },
          error: (error: { message: string; }) => {
            this.errorMessage = 'Error updating user';
            console.error('Error Editing User:', error);
          }
        });    
      } else {
        this.router.navigate(['/unauthorized']);
      }
    }
  }

  resetForm() {
    this.userForm.reset();
  }

  canEdit(userId: string): boolean {
    return this.currentUser.role === 'Admin' || userId === this.currentUser.sub;
  }
}