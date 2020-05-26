import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private _translateService: TranslateService) {
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
