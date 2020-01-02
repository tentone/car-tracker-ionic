import {Component} from '@angular/core';
import {Tracker} from '../../../../data/tracker';
import {App} from '../../../../app';
import {ScreenComponent} from '../../../screen';
import {TrackersLayout} from '../trackers-layout';

@Component({
  selector: 'app-trackers-view',
  templateUrl: 'trackers-view.page.html'
})
export class TrackersViewPage extends ScreenComponent {
  get layout() { return TrackersLayout.layout; }
  get app() { return App; }
  /**
   * Tracker being edited on this page.
   */
  public tracker: Tracker = null;

  public setMoveLimit() {
    let distance = prompt('Distance (m)');
    this.tracker.setMoveLimit(Number(distance));
  }

  public setSpeedLimit() {
    let speed = prompt('Speed (mp/h)');
    this.tracker.setSpeedLimit(Number(speed));
  }

  public onDisplay() {
    this.tracker = App.navigator.getData();
    if (this.tracker === null) {
      App.navigator.pop();
    }
  }

  /**
   * Delete tracker from the list.
   */
  public delete() {
    let index = App.trackers.indexOf(this.tracker);
    if (index !== -1) {
      App.trackers.splice(index, 1);
      App.store();
      App.navigator.pop();
    }
  }
}
