import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ]
})
export class AppComponent {
  private _translateService = inject(TranslateService);
  year = new Date().getFullYear();

  constructor() {
    // Add languages
    this._translateService.addLangs(['en', 'hu']);

    // Set the default language
    this._translateService.setDefaultLang('hu');

    // Use a language
    this._translateService.use('hu');

    // ngxTranslate Fix Start
    setTimeout(() => {
      this._translateService.setDefaultLang('en');
      this._translateService.setDefaultLang('hu');
    });
  }

  changeLang(lang: string): void {
    this._translateService.use(lang);
  }
}
