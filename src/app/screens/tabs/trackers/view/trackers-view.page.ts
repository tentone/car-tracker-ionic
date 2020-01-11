import {Component} from '@angular/core';
import {Tracker} from '../../../../data/tracker';
import {App} from '../../../../app';
import {ScreenComponent} from '../../../screen';
import {TrackersLayout} from '../trackers-layout';
import {Locale} from '../../../../locale/locale';

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

  public setSleepTime() {
    let time = prompt(Locale.get('sleepTime'));
    this.tracker.setSleepTime(Number(time));
  }

  public setSpeedLimit() {
    let speed = prompt(Locale.get('maxSpeed'));
    this.tracker.setSpeedLimit(Number(speed));
  }

  public setTimezone() {
    let timezone = prompt(Locale.get('timezone'));
    this.tracker.setTimezone(timezone);
  }

  public changePin() {
    let pin = prompt(Locale.get('changePin'));
    this.tracker.changePIN(pin);
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
