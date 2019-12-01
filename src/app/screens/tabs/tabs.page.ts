import {Component} from '@angular/core';
import {App} from '../../app';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html'
})
export class TabsPage {
  get app() { return App; }

  constructor() {}

  /**
   * List of pages available from the menu.
   *
   * Used to create the page content for booth desktop and mobile.
   */
  public pages = [
    {
      route: 'tabs/map',
      tab: 'map',
      icon: 'map',
      label: 'map',
    },
    {
      route: 'tabs/map',
      tab: 'map',
      icon: 'map',
      label: 'map',
    }
  ];
}
