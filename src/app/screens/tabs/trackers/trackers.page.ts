import {Component} from '@angular/core';

@Component({
  selector: 'app-trackers',
  templateUrl: 'trackers.page.html'
})
export class TrackersPage {
  /**
   * List of tracker to be listed in this page.
   */
  public trackers = [];

  constructor() {}
}
