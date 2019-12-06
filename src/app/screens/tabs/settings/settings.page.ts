import {Component} from '@angular/core';
import {Environment} from '../../../../environments/environment';
import {Locale} from '../../../locale/locale';
import {App} from '../../../app';
import {Settings} from '../../../data/settings';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html'
})
export class SettingsPage {
  get app() { return App; }
  get locale() { return Locale; }
  get environment() { return Environment; }
  get mapStyles() { return Settings.MAP_STYLES; }

  constructor() {}

}
