import {Component} from '@angular/core';
import {SMS} from '@ionic-native/sms';
@Component({
  selector: 'app-test',
  templateUrl: 'test.page.html'
})
export class TestPage {
  constructor(private sms: SMS) { }

  public sendSMS() {
    this.sms.send('+351915939715', 'Hello world!');
  }
}
