import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { CommonComponentsModule } from '@fairys-nx-workshop/common';
import { RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { PageNotFoundComponent } from './page-not-found/PageNotFound.component';
import { ThemeService } from './theme/theme.service';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';



@NgModule({
  imports: [CommonModule, RouterLink, CommonComponentsModule],
  providers: [CookieService, ThemeService],
  declarations: [
  ],
  exports: [
  ],
})
export class UiModule {}
