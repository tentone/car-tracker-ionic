import {Component} from '@angular/core';
import {SMS, SmsOptions} from '@ionic-native/sms/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-test',
  templateUrl: 'test.page.html'
})
export class TestPage {
  constructor(public androidPermissions: AndroidPermissions, public sms: SMS) {}
  
  public sendSMS() {
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(() => {
      let options: SmsOptions = {
        replaceLineBreaks: false,
        android: {
          intent: ''
        }
      };

      if (this.sms.hasPermission()) {
        this.sms.send('+351915939715', 'Hello world!', options);
      }
    });


  }
}
