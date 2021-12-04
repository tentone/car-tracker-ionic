import {Component} from '@angular/core';
import {Tracker} from '../../../data/tracker/tracker';
import {App} from '../../../app';
import {TrackerLayout} from '../tracker-layout';
import {Locale} from '../../../locale/locale';
import {ActionSheetController} from '@ionic/angular';
import {FileIo} from '../../../io/file-io';
import {Modal} from '../../../modal';

@Component({
  selector: 'app-trackers-view',
  templateUrl: 'tracker-view.page.html'
})
export class TrackerViewPage {
  get layout() { return TrackerLayout.layout; }
  get app() { return App; }

  get trackerLocation() {
    if (this.tracker === null) {
      return null;
    }

    return this.tracker.getLastPosition();
  }

  /**
   * Tracker being edited on this page.
   */
  public tracker: Tracker = null;

  public ngOnInit(): void {
    this.tracker = App.navigator.getData();

    if (this.tracker === null) {
      App.navigator.pop();
    }
  }

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
            App.navigator.navigate('tabs/trackers/logs', this.tracker);
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
            Modal.prompt(Locale.get('timezone'), [{name: 'timezone', placeholder: Locale.get('timezone')}], (confirm, data) => {
              if (confirm) {
                this.tracker.setTimezone(data.timezone);
              }
            });
          }
        },
        {
          text: Locale.get('setSpeedLimit'),
          icon: 'speedometer',
          handler: () => {
            Modal.prompt(Locale.get('maxSpeed'), [{name: 'maxSpeed', placeholder: Locale.get('maxSpeed'), type: 'number'}], (confirm, data) => {
              if (confirm) {
                const maxSpeed = Number.parseInt(data.maxSpeed, 10);
                this.tracker.setSpeedLimit(maxSpeed);
              }
            });
          }
        },
        {
          text: Locale.get('changePin'),
          icon: 'key',
          handler: () => {
            Modal.prompt(Locale.get('changePin'), [{name: 'pin', placeholder: Locale.get('changePin')}], (confirm, data) => {
              if (confirm) {
                this.tracker.changePIN(data.pin);
              }
            });
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
            Modal.prompt(Locale.get('slot'), [{name: 'slot', placeholder: Locale.get('slot'), type: 'number'}, {name: 'phoneNumber', placeholder: Locale.get('phoneNumber')}], (confirm, data) => {
              if (confirm) {
                let phoneNumber = data.phoneNumber;
                let slot = Number.parseInt(data.slot, 10);
                this.tracker.setSOSNumber(phoneNumber, slot);
              }
            });
          }
        },
        {
          text: Locale.get('deleteSosNumber'),
          icon: 'trash',
          handler: () => {
            Modal.prompt(Locale.get('slot'), [{name: 'slot', placeholder: Locale.get('slot'), type: 'number'}], (confirm, data) => {
              if (confirm) {
                let slot = Number.parseInt(data.slot, 10);
                this.tracker.deleteSOSNumber(slot);
              }
            });
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
}
