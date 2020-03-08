import {Component, ElementRef} from '@angular/core';
import {Tracker} from '../../../../data/tracker';
import {App} from '../../../../app';
import {ScreenComponent} from '../../../screen';
import {TrackersLayout} from '../trackers-layout';
import {Locale} from '../../../../locale/locale';
import {ActivatedRoute} from '@angular/router';
import {ActionSheetController} from '@ionic/angular';
import {FileIo} from '../../../../io/file-io';
import {Modal} from '../../../modal';

@Component({
  selector: 'app-trackers-view',
  templateUrl: 'trackers-view.page.html'
})
export class TrackersViewPage extends ScreenComponent {
  get layout() { return TrackersLayout.layout; }
  get app() { return App; }

  constructor(public route: ActivatedRoute, public elementRef: ElementRef) {
    super(route, elementRef);
  }

  /**
   * Tracker being edited on this page.
   */
  public tracker: Tracker = null;

  /**
   * Open action sheet with options to edit the tracker.
   */
  public openActionSheet: Function = () => {
    let controller = new ActionSheetController();
    controller.create({
      header: Locale.get('options'),
      buttons: [
        {
          text: Locale.get('history'),
          icon: 'reorder-four',
          handler: () => {
            App.navigator.navigate('tabs/trackers/history', this.tracker);
          }
        },
        {
          text: Locale.get('adminNumber'),
          icon: 'person',
          handler: () => {
            this.tracker.setAdminNumber(App.settings.adminNumber);
          }
        },
        {
          text: Locale.get('getTrackerInfo'),
          icon: 'information-circle',
          handler: () => {
            this.tracker.getTrackerInfo();
          }
        },
        {
          text: Locale.get('setSleepTime'),
          icon: 'bed',
          handler: () => {
            Modal.prompt(Locale.get('sleepTime'), [{name: 'sleepTime', placeholder: Locale.get('sleepTime'), type: 'number'}], (confirm, data) => {
              if (confirm) {
                const sleepTime = Number.parseInt(data.sleepTime, 10);
                this.tracker.setSleepTime(sleepTime);
              }
            });
          }
        },
        {
          text: Locale.get('setTimezone'),
          icon: 'time',
          handler: () => {
            let timezone = prompt(Locale.get('timezone'));
            this.tracker.setTimezone(timezone);
          }
        },
        {
          text: Locale.get('setSpeedLimit'),
          icon: 'speedometer',
          handler: () => {
            let speed = prompt(Locale.get('maxSpeed'));
            this.tracker.setSpeedLimit(Number(speed));
          }
        },
        {
          text: Locale.get('changePin'),
          icon: 'key',
          handler: () => {
            let pin = prompt(Locale.get('changePin'));
            this.tracker.changePIN(pin);
          }
        },
        {
          text: Locale.get('listSosNumbers'),
          icon: 'warning',
          handler: () => {
            this.tracker.listSOSNumbers();
          }
        },
        {
          text: Locale.get('addSosNumber'),
          icon: 'person-add',
          handler: () => {
            let phoneNumber = prompt(Locale.get('phoneNumber'));
            let slot = Number.parseInt(prompt(Locale.get('slot')), 10);
            this.tracker.setSOSNumber(phoneNumber, slot);
          }
        },
        {
          text: Locale.get('deleteSosNumber'),
          icon: 'trash',
          handler: () => {
            let slot = Number.parseInt(prompt(Locale.get('slot')), 10);
            this.tracker.deleteSOSNumber(slot);
          }
        },
        {
          text: Locale.get('export'),
          icon: 'save',
          handler: () => {
            let data = JSON.stringify(this.tracker, null, '\t');
            FileIo.write('tracker.json', data);
          }
        },
        {
          text: Locale.get('deleteTracker'),
          icon: 'trash',
          handler: () => {
            if (confirm(Locale.get('deleteTrackerConfirm'))) {
              let index = App.trackers.indexOf(this.tracker);
              if (index !== -1) {
                App.trackers.splice(index, 1);
                App.store();
                App.navigator.pop();
              }
            }
          }
        }
      ]}).then((actionSheet) => {
      actionSheet.present();
    });
  }

  public onDisplay() {
    this.tracker = App.navigator.getData();

    if (this.tracker === null) {
      App.navigator.pop();
    }
  }
}
