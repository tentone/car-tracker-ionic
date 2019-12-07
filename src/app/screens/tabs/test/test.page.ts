import {Component} from '@angular/core';
import {App} from '../../../app';

@Component({
  selector: 'app-test',
  templateUrl: 'test.page.html'
})
export class TestPage {
  
  public sendSMS() {
    App.sendSMS('+351915939715', 'Hello world!');
  }
}
