import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Role } from '@game-platform/shared/api';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'lib-game-review-user-create',
  templateUrl: './user-create.component.html',
  styles: [],
})
export class UserCreateComponent implements OnInit {

  currentUser: any;


  userForm = new FormGroup({
    name: new FormControl('', Validators.required),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    birthDate: new FormControl('', Validators.required),
    address: new FormGroup({
      street: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      zipCode: new FormControl(''),
      country: new FormControl('')
    }),
    role: new FormControl('', Validators.required),
    preferredSports: new FormControl([]),
    qualifications: new FormControl([]),
    specializations: new FormControl([])
  });

  successMessage: string | null = null;
  errorMessage: string | null = null;
  roles = Object.values(Role);

  constructor(private userService: UserService, private router: Router,
    private authService: AuthService) {}

  ngOnInit(): void {
        this.currentUser = this.authService.decodeToken();
  }

  get f() { return this.userForm.controls; }

  resetForm() {
    this.userForm.reset();
    // Optionally reset nested form groups if needed
  }
  
  onSubmit() {
    if(this.canCreate()) {
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