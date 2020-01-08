import {Component} from '@angular/core';
import {Tracker} from '../../../../data/tracker';
import {App} from '../../../../app';
import {ScreenComponent} from '../../../screen';

@Component({
  selector: 'app-trackers-history',
  templateUrl: 'trackers-history.page.html'
})
export class TrackersHistoryPage extends ScreenComponent {
  get app() { return App; }

  /**
   * Tracker being visualized on this page.
   */
  public tracker: Tracker ;
  
  public onDisplay() {
    this.tracker = App.navigator.getData();

  }
}