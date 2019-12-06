import {Component} from '@angular/core';

@Component({
  selector: 'app-trackers-add',
  templateUrl: 'trackers-add.page.html'
})
export class TrackersAddPage {
  /**
   * List of tracker to be listed in this page.
   */
  public trackers = [];

  constructor() {}
}
