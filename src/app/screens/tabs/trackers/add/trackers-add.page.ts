import {Component} from '@angular/core';
import {Tracker} from '../../../../data/tracker';
import {App} from '../../../../app';

@Component({
  selector: 'app-trackers-add',
  templateUrl: 'trackers-add.page.html'
})
export class TrackersAddPage {
  get app() { return App; }

  /**
   * Tracker being edited on this page.
   */
  public tracker: Tracker;

  constructor() {
    this.tracker = new Tracker();
  }

  /**
   * Add tracker into the list.
   */
  public add() {
    App.trackers.push(this.tracker);
    App.store();
    App.navigator.pop();
  }
}
