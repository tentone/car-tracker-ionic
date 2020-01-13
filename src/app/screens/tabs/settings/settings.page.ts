import {Component} from '@angular/core';
import {Environment} from '../../../../environments/environment';
import {Locale} from '../../../locale/locale';
import {App} from '../../../app';
import {Settings} from '../../../data/settings';
import {FormObjectField} from '../../../components/form-object/form-object-field';
import {FormObjectType} from '../../../components/form-object/form-object-type';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html'
})
export class SettingsPage {
  get app() { return App; }
  get locale() { return Locale; }
  get environment() { return Environment; }

  /**
   * Layout of the settings object.
   */
  public layout: FormObjectField[] = [
    {
      attribute: 'mapStyle',
      type: FormObjectType.OPTIONS,
      options: [
        {
          value: Settings.MAP_STYLES.VECTOR,
          label: 'vector'
        },
        {
          value: Settings.MAP_STYLES.SATELLITE,
          label: 'satellite'
        },
        {
          value: Settings.MAP_STYLES.MIXED,
          label: 'mixed'
        },
        {
          value: Settings.MAP_STYLES.LIGHT,
          label: 'light'
        },
        {
          value: Settings.MAP_STYLES.DARK,
          label: 'dark'
        }
      ],
      required: false
    },
    {
      attribute: 'adminNumber',
      type: FormObjectType.PHONE,
      required: false
    }
  ];

  public onChange() {
    App.store();
  }

  constructor() {}

}
