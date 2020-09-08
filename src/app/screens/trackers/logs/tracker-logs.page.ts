import {Component} from '@angular/core';
import {Tracker} from '../../../tracker/tracker';
import {App} from '../../../app';
import {MessageTypeLabel} from '../../../tracker/tracker-message';

@Component({
  selector: 'app-trackers-history',
  templateUrl: 'tracker-logs.page.html'
})
export class TrackerLogsPage {
  get app() { return App; }
  get json() { return JSON; }
  get messageTypeLabel() { return MessageTypeLabel; }

  /**
   * Tracker being visualized on this page.
   */
  public tracker: Tracker;
  
  public ngOnInit(): void {
    this.tracker = App.navigator.getData();
  }
}
