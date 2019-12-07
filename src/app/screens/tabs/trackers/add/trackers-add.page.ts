import {Component} from '@angular/core';
import {Tracker} from '../../../../data/tracker';

@Component({
  selector: 'app-trackers-add',
  templateUrl: 'trackers-add.page.html'
})
export class TrackersAddPage {
  /**
   * Tracker being edited on this page.
   */
  public tracker: Tracker;

  constructor() {
    this.tracker = new Tracker();
  }

  public addTracker() {
    console.log(this.tracker);
  }
}
