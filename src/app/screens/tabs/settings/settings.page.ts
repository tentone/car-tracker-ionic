import {Component} from '@angular/core';
import {Environment} from '../../../../environments/environment';
import {Locale} from '../../../locale/locale';
import {App} from '../../../app';
import {FormObjectField} from '../../../components/form-object/form-object-field';
import {FormObjectType} from '../../../components/form-object/form-object-type';
import {Themes} from '../../../theme';
import {MapStyles} from "../../../data/map-styles";

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
      attribute: 'locale',
      type: FormObjectType.OPTIONS,
      required: false,
      editable: true,
      options: [
        {
          label: 'en',
          value: 'en'
        }
      ]
    },
    {
      attribute: 'adminNumber',
      type: FormObjectType.PHONE,
      required: false,
      editable: true
    },
    {
      attribute: 'theme',
      type: FormObjectType.OPTIONS,
      required: false,
      editable: true,
      onChange: (object, attribute, oldValue, newValue) => {Themes.setTheme(newValue);},
      options: [
        {
          label: 'base',
          value: 'base'
        },
        {
          label: 'dark',
          value: 'dark'
        }
      ]
    },
    {
      attribute: 'mapStyle',
      type: FormObjectType.OPTIONS,
      options: [
        {
          value: MapStyles.VECTOR,
          label: 'vector'
        },
        {
          value: MapStyles.SATELLITE,
          label: 'satellite'
        },
        {
          value: MapStyles.MIXED,
          label: 'mixed'
        },
        {
          value: MapStyles.LIGHT,
          label: 'light'
        },
        {
          value: MapStyles.DARK,
          label: 'dark'
        }
      ],
      required: false,
      editable: true
    }
  ];

  public onChange() {
    App.store();
  }

  constructor() {}

}
