import {Component} from '@angular/core';
import {Tracker} from '../../../../data/tracker';
import {App} from '../../../../app';
import {ScreenComponent} from '../../../screen';
import {TrackersLayout} from '../trackers-layout';

@Component({
  selector: 'app-trackers-add',
  templateUrl: 'trackers-add.page.html'
})
export class TrackersAddPage extends ScreenComponent {
  get app() { return App; }
  get layout() { return TrackersLayout.layout; }

  /**
   * Tracker being edited on this page.
   */
  public tracker: Tracker = new Tracker();
  
  public onDisplay() {
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
