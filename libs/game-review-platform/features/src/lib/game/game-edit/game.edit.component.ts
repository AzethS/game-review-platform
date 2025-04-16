import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../game.service';
import { IGame } from '@game-platform/shared/api';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  selector: 'lib-game-edit',
  templateUrl: './game-edit.component.html',
})
export class GameEditComponent implements OnInit {
  gameForm = new FormGroup({
    title: new FormControl<string>('', Validators.required),
    description: new FormControl<string>('', Validators.required),
    genre: new FormControl<string[]>([], Validators.required),
    platform: new FormControl<string[]>([], Validators.required),
    releaseDate: new FormControl<string>('', Validators.required), // Expecting a string for form control
    createdBy: new FormControl<string>('', Validators.required),
  });

  gameId!: string;
  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id')!;
    if (this.gameId) {
      this.loadGame();
    }
  }

  loadGame(): void {
    this.loading = true;
    this.gameService.read(this.gameId).subscribe({
      next: (game: IGame) => {
        // Convert the releaseDate to string in ISO format
        const releaseDate = game.releaseDate
          ? new Date(game.releaseDate).toISOString().split('T')[0]
          : '';

        this.gameForm.patchValue({
          title: game.title,
          description: game.description,
          genre: game.genre,
          platform: game.platform,
          releaseDate: releaseDate, // Set as ISO string
          createdBy: game.createdBy,
        });
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load the game.';
        console.error('Load game error:', error);
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.gameForm.valid) {
      this.loading = true;

      // Sanitize form values
      const sanitizedData = this.sanitizeFormValues(this.gameForm.value);

      this.gameService.update(this.gameId, sanitizedData).subscribe({
        next: () => {
          this.successMessage = 'Game updated successfully!';
          this.loading = false;
          this.router.navigate(['/games']);
        },
        error: (error) => {
          this.errorMessage = 'Failed to update the game.';
          console.error('Update game error:', error);
          this.loading = false;
        },
      });
    }
  }

  // Helper to sanitize form values
  private sanitizeFormValues(formValues: any): Partial<IGame> {
    return {
      title: formValues.title || undefined,
      description: formValues.description || undefined,
      genre: formValues.genre || undefined,
      platform: formValues.platform || undefined,
      releaseDate: formValues.releaseDate ? new Date(formValues.releaseDate) : undefined, // Convert string back to Date
      createdBy: formValues.createdBy || undefined,
    };
  }
}
