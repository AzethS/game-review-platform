// libs/features/dashboard/src/lib/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'lib-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  user: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('/api/user/profile').subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Failed to load user data', error);
      }
    );
  }
}