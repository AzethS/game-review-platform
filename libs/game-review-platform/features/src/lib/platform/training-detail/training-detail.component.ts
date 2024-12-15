import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainingService } from '../training.service';
import { ITraining, IUser } from '@AthleteXperience/shared/api';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'athlete-xperience-training-detail',
  templateUrl: './training-detail.component.html',
  styles: [],
})
export class TrainingDetailComponent implements OnInit {
  trainingId!: string;
  training: ITraining | null = null;
  members: any;
  trainer: any;
  currentUser: any;
  isRegistered = false;

  constructor(private route: ActivatedRoute, private trainingService: TrainingService,
    private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.decodeToken();
    this.trainingId = this.route.snapshot.paramMap.get('id')!;
    if (this.trainingId) {
      this.trainingService.read(this.trainingId).subscribe(
        (training) => {
          this.training = training;
          this.trainer = training.trainer;
          this.members = training.members;

          if (this.members && this.currentUser) {
            this.isRegistered = this.members.includes(this.currentUser.sub);
          }

        },
        (error) => {
          console.error('Error fetching training details:', error);
        }
      );
    }
  }

  public deleteTraining(trainingId: string): void {
    if(confirm('Are you sure you want to delete this training?')) {
      if(this.canDelete()) {
      this.trainingService.delete(trainingId).subscribe(
        () => {
          console.log('Training deleted successfully');
          this.router.navigate(['/Trainings']);
        },
        (error: any) => {
          console.error('Error deleting training:', error);
        }
      );
      } else {
        console.error('Unauthorized deletion attempt');
        this.router.navigate(['/unauthorized']);
      }
    }
  }

  canDelete(): boolean {
    return this.currentUser.role === 'Admin' || ( this.currentUser.role === 'Trainer' && this.training?.authorId === this.currentUser.sub );
  }

  public toggleRegistration(): void {
    if (this.isRegistered) {
      this.removeRegistration(this.trainingId, this.currentUser.sub);
      this.isRegistered = false;
    } else {
      this.registerForTraining(this.trainingId, this.currentUser.sub);
      this.isRegistered = true;
    }
  }

  

  public registerForTraining(trainingId: string, userId: string): void {
    if (this.currentUser && userId) {
      this.trainingService.registerForTraining(trainingId, userId).subscribe(
        () => {
          console.log('User registered for training successfully');
        },
        (error: any) => {
          console.error('Error registering user for training:', error);
        }
      );
    } else {
      console.error('Invalid user or userId');
    }
  }


  public removeRegistration(trainingId: string, userId: string): void {
    if (this.currentUser && userId) {
      this.trainingService.removeRegistration(trainingId, userId).subscribe(
        () => {
          console.log('User registration removed successfully');
        },
        (error: any) => {
          console.error('Error removing user registration:', error);
        }
      );
    } else {
      console.error('Invalid user or userId');
    }
  }
}
