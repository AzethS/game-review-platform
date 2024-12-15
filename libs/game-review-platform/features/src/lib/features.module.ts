import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { GameService } from './game/game.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
  ],
  providers: [
    GameService,
    provideHttpClient(withInterceptorsFromDi()), 
  ],
  exports: [
  ],
})
export class FeaturesModule {}
