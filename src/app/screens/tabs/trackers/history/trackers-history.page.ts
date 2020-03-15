import {Component} from '@angular/core';
import {Tracker} from '../../../../data/tracker';
import {App} from '../../../../app';
import {ScreenComponent} from '../../../screen';
import {MessageTypeLabel} from '../../../../data/tracker-message';

@Component({
  selector: 'app-trackers-history',
  templateUrl: 'trackers-history.page.html'
})
export class TrackersHistoryPage extends ScreenComponent {
  get app() { return App; }
  get json() { return JSON; }
  get messageTypeLabel() { return MessageTypeLabel; }

  /**
   * Tracker being visualized on this page.
   */
  public tracker: Tracker;
  
  public onDisplay() {
    this.tracker = App.navigator.getData();
    // console.log('CarTracker: Tracker messages.', this.tracker);
  }
}
