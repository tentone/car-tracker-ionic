import {Component} from '@angular/core';
import {SMS} from '@ionic-native/sms/ngx';

@Component({
  selector: 'app-test',
  templateUrl: 'test.page.html'
})
export class TestPage {
  constructor(public sms: SMS) {
  }

  public sendSMS() {
    let options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
        intent: ''
      }
    };

    this.sms.send('+351915939715', 'Hello world!');
  }
}
