import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { NavbarComponent } from '@fairys-nx-workshop/ui';
import { FooterComponent } from '@fairys-nx-workshop/ui';
import { AboutComponent } from '@fairys-nx-workshop/ui';
import { PageNotFoundComponent } from '@fairys-nx-workshop/ui';
import { UnauthorizedComponent } from '@fairys-nx-workshop/ui';
import { FeaturesModule } from '@fairys-nx-workshop/features';
import { CommonComponentsModule } from '@fairys-nx-workshop/common';
import { CardComponent } from '@fairys-nx-workshop/common';
import { CommonModule } from '@angular/common';

import {
  UserListComponent,
  UserCreateComponent,
  UserDetailsComponent,
  UserEditComponent,
  ReviewCreateComponent,
  ReviewDetailsComponent,
  ReviewEditComponent,
  ReviewListComponent,
  LoginComponent,
} from '@fairys-nx-workshop/features';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NxWelcomeComponent,
    RouterModule,
    NavbarComponent, // Import standalone components directly
    FooterComponent,
    AboutComponent,
    PageNotFoundComponent,
    UnauthorizedComponent,
    FeaturesModule,
    CommonComponentsModule,
    UserListComponent,
    UserCreateComponent,
    UserDetailsComponent,
    UserEditComponent,
    ReviewCreateComponent,
    ReviewDetailsComponent,
    ReviewEditComponent,
    ReviewListComponent,
    LoginComponent,
    CardComponent,
  ],
  selector: 'app-game-review-recommendation-platform-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'game-review-platform';
}
