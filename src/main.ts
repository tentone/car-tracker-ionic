import 'zone.js/dist/zone';
import {enableProdMode, PlatformRef} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {Environment} from './environments/environment';

if (Environment.production) {
  enableProdMode();
}

const platform: PlatformRef = platformBrowserDynamic();
platform.bootstrapModule(AppModule, {
  ngZone:  'zone.js' // 'noop'
});
