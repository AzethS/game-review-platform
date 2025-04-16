import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'lib-game-review-page-not-found',
  templateUrl: './PageNotFound.component.html',
  styles: [],
})
export class PageNotFoundComponent {}
