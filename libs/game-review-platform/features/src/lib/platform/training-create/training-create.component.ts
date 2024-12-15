import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { TrainingService } from '../training.service';
import { TrainingType } from '@AthleteXperience/shared/api';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'athlete-xperience-training-create',
  templateUrl: './training-create.component.html',
  styles: [],
})
export class TrainingCreateComponent implements OnInit{

  currentUser: any;

  trainingForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    trainerId: new FormControl(''),
    duration: new FormControl('', [Validators.required, Validators.min(1)]),
    trainer: new FormControl(''),
    isTopRated: new FormControl(false),
    date: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    members: new FormControl([])
  });

  successMessage: string | null = null;
  errorMessage: string | null = null;
  trainingTypes = Object.values(TrainingType);
  trainers: any[] = [];
  members: any[] = [];
  selectedTrainerName = '';
  selectedMemberNames: string[] = [];

  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  constructor(private trainingService: TrainingService, private router: Router,
    private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
        this.currentUser = this.authService.decodeToken();
        this.fetchTrainers();
        this.fetchMembers();
  }

  get f() { return this.trainingForm.controls; }

  resetForm() {
    // Resetting form values and states
    this.trainingForm.reset({
      name: '',
      description: '',
      location: '',
      trainerId: '',
      duration: '',
      trainer: '',
      isTopRated: false,
      date: '',
      type: '',
      members: []
      // Set default values for other fields if needed
    });
    // Optionally, if you need to reset the form's submitted state
    this.trainingForm.markAsPristine();
    this.trainingForm.markAsUntouched();
  };

  fetchTrainers() {
    this.userService.getTrainers().subscribe(
      (trainers: any) => {
        this.trainers = trainers;
      },
      (error: any) => {
        console.error('Error fetching trainers:', error);
      }
    );
  }

  fetchMembers() {
    this.userService.getMembers().subscribe(
      (members: any) => {
        this.members = members;
      },
      (error: any) => {
        console.error('Error fetching trainers:', error);
      }
    );
  }
  
  onMemberSelectChange(memberId: string, isSelected: boolean) {
    const member = this.members.find(m => m._id === memberId);
    if (member) {
      member.selected = isSelected;
    }
  }

  onSubmit() {
    if(this.canCreate()) {
      const selectedTrainer = this.trainers.find(trainer => trainer.name === this.selectedTrainerName);
      const selectedMembersIds = this.members.filter(member => member.selected).map(member => member._id);
      if (this.trainingForm.valid) {
        const formData = {
          ...this.trainingForm.value,
          authorId: this.currentUser.sub,
          date: this.trainingForm.value.date ? new Date(this.trainingForm.value.date).toISOString() : '',
          trainer: selectedTrainer ? selectedTrainer._id : null,
          members: selectedMembersIds
        };

        this.trainingService.create(formData).subscribe(
          (response: any) => {
            this.successMessage = 'Training created successfully!';
            console.log('Training created:', response);
            this.resetForm();
            this.router.navigate(['/Trainings']);
          },
          (error: any) => {
            this.errorMessage = 'Error creating training';
            console.error('Error creating training:', error);
          }
        );
      }
    } else {
      this.router.navigate(['/unauthorized']);
    }
  }

  canCreate(): boolean {
    return this.currentUser.role === 'Admin' || this.currentUser.role === 'Trainer';
  }
}
