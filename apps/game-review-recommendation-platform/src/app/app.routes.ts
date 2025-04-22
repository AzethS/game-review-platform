import { Route } from '@angular/router';
import { 
  LoginComponent, 
  // DashboardComponent, 
  HomeComponent,
  AuthGuard, 
  // ReviewListComponent, 
  // ReviewCreateComponent, 
  // ReviewEditComponent, 
  // ReviewDetailsComponent, 
  UserListComponent, 
  UserCreateComponent, 
  UserEditComponent, 
  UserDetailsComponent, 
  GameListComponent,
  GameDetailComponent,
  RegisterComponent
} from '@fairys-nx-workshop/features';
import { AboutComponent, PageNotFoundComponent, UnauthorizedComponent } from '@fairys-nx-workshop/ui';

export const appRoutes: Route[] = [
  // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  
  // Reviews routes
  // { path: 'reviews', component: ReviewListComponent, canActivate: [AuthGuard] },
  // { path: 'reviews/create', component: ReviewCreateComponent, canActivate: [AuthGuard] },
  // { path: 'reviews/edit/:id', component: ReviewEditComponent, canActivate: [AuthGuard] },
  // { path: 'reviews/details/:id', component: ReviewDetailsComponent, canActivate: [AuthGuard] },
  
  // Users routes
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'users/create', component: UserCreateComponent, canActivate: [AuthGuard] },
  { path: 'users/edit/:id', component: UserEditComponent, canActivate: [AuthGuard] },
  { path: 'users/details/:id', component: UserDetailsComponent, canActivate: [AuthGuard] },

  // Games routes
  { path: 'games', component: GameListComponent },
  { path: 'games/details/:id', component: GameDetailComponent },

  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'pagenotfound', component: PageNotFoundComponent },
  { path: 'about', pathMatch: 'full', component: AboutComponent  },


  
  { path: '**', component: PageNotFoundComponent}, // Fallback for invalid routes
];
