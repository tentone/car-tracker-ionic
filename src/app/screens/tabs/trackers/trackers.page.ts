import {Component} from '@angular/core';
import {App} from '../../../app';

@Component({
  selector: 'app-trackers',
  templateUrl: 'trackers.page.html'
})
export class TrackersPage {
  get app() { return App; }
  /**
   * List of tracker to be listed in this page.
   */
  public trackers = [];

  /**
   * Text used to filter tracker by its name.
   */
  public search: string = '';

  constructor() {}

  /**
   * Update the search term used.
   *
   * @param event DOM event.
   */
  public onSearch(event) {
    this.search = event.target.value;
  }
}
