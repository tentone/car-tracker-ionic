import {Component} from '@angular/core';
import {App} from '../../app';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html'
})
export class TabsPage {
  get app() { return App; }

  /**
   * List of pages available from the menu.
   */
  public pages = [
    {
        route: 'tabs/test',
        tab: 'test',
        icon: 'bug',
        label: 'test',
    },
    {
        route: 'tabs/trackers',
        tab: 'trackers',
        icon: 'locate',
        label: 'trackers',
    },
    {
        route: 'tabs/trackers',
        tab: 'map',
        icon: 'map',
        label: 'map',
    },
    {
        route: 'tabs/settings',
        tab: 'settings',
        icon: 'settings',
        label: 'settings',
    }
  ];
}
