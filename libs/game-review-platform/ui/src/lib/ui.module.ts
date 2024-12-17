import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { CommonComponent } from '@fairys-nx-workshop/common';
import { RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { PageNotFoundComponent } from './page-not-found/PageNotFound.component';
import { ThemeService } from './theme/theme.service';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

@NgModule({
  imports: [CommonModule, RouterLink, CommonComponent],
  providers: [CookieService, ThemeService],
  declarations: [
    NavbarComponent,
    FooterComponent,
    AboutComponent,
    PageNotFoundComponent,
    UnauthorizedComponent,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    AboutComponent,
    PageNotFoundComponent,
    UnauthorizedComponent
  ],
})
export class UiModule {}
