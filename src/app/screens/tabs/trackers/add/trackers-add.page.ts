import {Component} from '@angular/core';
import {Tracker} from '../../../../tracker/tracker';
import {App} from '../../../../app';
import {ScreenComponent} from '../../../screen';
import {TrackersLayout} from '../view/trackers-layout';

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
  
  public onDisplay(): void {
    this.tracker = new Tracker();
  }

  /**
   * Add tracker into the list.
   */
  public add(): void {
    App.trackers.push(this.tracker);
    App.store();
    App.navigator.pop();
  }
}
