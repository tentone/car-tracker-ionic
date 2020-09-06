import {Component} from '@angular/core';
import {Tracker} from '../../../../tracker/tracker';
import {App} from '../../../../app';
import {ScreenComponent} from '../../../screen';
import {MessageTypeLabel} from '../../../../tracker/tracker-message';

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
  
  public onDisplay(): void {
    this.tracker = App.navigator.getData();
  }
}
