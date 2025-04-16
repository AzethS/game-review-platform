import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.Guard';
import { UserService } from './user/user.service';
import { ReviewService } from './review/review.service';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
  declarations: [],
  providers: [
    AuthService,
    AuthGuard,
    UserService,
    ReviewService,
    CookieService,
  ],
  exports: [],
})
export class FeaturesModule {}
