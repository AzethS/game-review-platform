import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { ITraining } from '@AthleteXperience/shared/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
// import { Id } from 'libs/shared/api/src/lib/models/id.type';
import { Id } from '@AthleteXperience/shared/api';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'athlete-xperience-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css'],
})
export class TrainingListComponent implements OnInit, OnDestroy {
    trainings: ITraining[] | null = null;
    subscription: Subscription | undefined = undefined;
    currentUser: any;

    constructor(private trainingService: TrainingService, private router: Router,
        private authService: AuthService ) {}

    ngOnInit(): void {
        this.currentUser = this.authService.decodeToken();
        this.subscription = this.trainingService.list().subscribe((results) => {
            console.log(`results: ${results}`);
            this.trainings = results;
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }

    goToTrainingDetail(trainingId: Id): void {
        console.log(trainingId);
        this.router.navigate(['/Trainings', trainingId]);
      }
}
