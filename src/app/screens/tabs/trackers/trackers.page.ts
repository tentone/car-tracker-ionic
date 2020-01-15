import {Component} from '@angular/core';
import {App} from '../../../app';
import {StringUtils} from '../../../utils/string-utils';
import {Locale} from '../../../locale/locale';
import {FileUtils} from '../../../utils/file-utils';
import {ActionSheetController} from '@ionic/angular';
import {Modal} from '../../modal';

@Component({
  selector: 'app-trackers',
  templateUrl: 'trackers.page.html'
})
export class TrackersPage {
  get app() { return App; }
  get stringUtils() { return StringUtils; }

  /**
   * Text used to filter tracker by its name.
   */
  public search: string = '';

  /**
   * Open action sheet with options to edit the tracker.
   */
  public openActionSheet: Function = () => {
    let controller = new ActionSheetController();
    controller.create({
      header: Locale.get('options'),
      buttons: [
        {
          text: Locale.get('import'),
          icon: 'download',
          handler: () => {
            FileUtils.chooseFile((files) => {
              if (files.length > 0) {
                let reader = new FileReader();
                reader.readAsText(files[0]);
                reader.onload = () => {
                  try {
                    // @ts-ignore
                    let tracker = JSON.parse(reader.result);
                    App.trackers.push(tracker);
                    App.store();
                  } catch (e) {
                    Modal.alert(Locale.get('error'),  Locale.get('errorImport'));
                  }
                };
              }
            }, '.json', false);

          }
        }
      ]
    }).then((actionSheet) => {
      actionSheet.present();
    });
  };

  /**
   * Update the search term used.
   *
   * @param event DOM event.
   */
  public onSearch(event) {
    this.search = event.target.value;
  }
}
