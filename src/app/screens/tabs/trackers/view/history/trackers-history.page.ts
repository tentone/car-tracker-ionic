import {Component} from '@angular/core';
import {Tracker} from '../../../../../data/tracker';
import {App} from '../../../../../app';
import {ScreenComponent} from '../../../../screen';

@Component({
  selector: 'app-trackers-history',
  templateUrl: 'trackers-history.page.html'
})
export class TrackersHistoryPage extends ScreenComponent {
  /**
   * Tracker being edited on this page.
   */
  public tracker: Tracker;

  public display() {
    this.tracker = App.navigator.getData();
    if (this.tracker === null) {
      App.navigator.pop();
    }
  }
}
