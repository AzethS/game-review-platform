import { Component, OnInit  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingService } from '../training.service';
import { TrainingType } from '@AthleteXperience/shared/api';

@Component({
  selector: 'athlete-xperience-training-edit',
  templateUrl: './training-edit.component.html',
  styles: [],
})
export class TrainingEditComponent implements OnInit {

  trainingForm: FormGroup;
  successMessage!: string | null;
  errorMessage!: string | null;
  trainingTypes = Object.values(TrainingType);
  trainingId!: string;


  constructor(
    private trainingService: TrainingService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.trainingForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      duration: new FormControl('', [Validators.required, Validators.min(1)]),
      trainer: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      isTopRated: new FormControl('', Validators.required),
      members: new FormControl('')
    });
  }
  
  get f() {
    return this.trainingForm.controls;
  }
  
  ngOnInit(): void {
    this.trainingId = this.route.snapshot.paramMap.get('id')!;
    if (this.trainingId) {
      // Fetch the training data and update the form
      this.trainingService.read(this.trainingId).subscribe(trainingData => {
        this.trainingForm.patchValue(trainingData);
      });
    }
  }


  onSubmit() {
    // Submit the form data
    if (this.trainingForm.valid) {
      // const trainingId = this.route.snapshot.paramMap.get('id');
      if (this.trainingId) {
        this.trainingService.update(this.trainingId, this.trainingForm.value).subscribe({
          next: (response: any) => {
            this.successMessage = 'Training updated successfully';
            console.log('Training Edited:', response);
            // Optionally redirect the user or perform other actions
            this.router.navigate([`/Trainings/${this.trainingId}`]);
          },
          error: (error: { message: string; }) => {
            this.errorMessage = 'Error updating training';
            console.error('Error Editing training:', error);
          }
        });    
      }
    }
  }

  resetForm() {
    this.trainingForm.reset();
  }
}
