import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './shared/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Ecommerce';

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.translate.addLangs(['en-US', 'es-419']);
    this.translate.setDefaultLang('en-US');

    const current = this.languageService.current || 'en-US';
    this.translate.use(current);

    this.languageService.lang$.subscribe(code => {
      if (code) this.translate.use(code);
    });
  }

  ngOnInit(): void {
    // setTimeout(() => {
    //   HOMEINIT($);
    // }, 50);
  }
}
