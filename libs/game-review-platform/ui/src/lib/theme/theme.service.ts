import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService { 
  private readonly themeKey = 'darkMode';

  constructor() {
    this.loadTheme();
  }

  toggleDarkMode(): void {
    const isDarkMode = this.isDarkMode();
    localStorage.setItem(this.themeKey, JSON.stringify(!isDarkMode));
    this.applyTheme();
  }

  isDarkMode(): boolean {
    return JSON.parse(localStorage.getItem(this.themeKey) || 'false');
  }

  private loadTheme(): void {
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDarkMode()) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}
