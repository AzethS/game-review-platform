import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-game-review-about',
  templateUrl: './about.component.html',
  styles: [],
})
export class AboutComponent implements OnInit {
  imagePath?: string;
  ngOnInit(): void{
    this.imagePath = 'assets/ERD-game-review.png';
  }
}
