import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { GameListComponent } from '@fairys-nx-workshop/features';


@Component({
  imports: [NxWelcomeComponent, RouterModule, GameListComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'game-review-recommendation-platform';
}
