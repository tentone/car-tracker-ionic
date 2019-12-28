# CarTracker
 - Mobile application to track car GPS position for SMS based trackers.
 - Compatible with SMS based trackers, here a list of some known trackers.
    - AS5000 GPS Tracker

### Setup
 - Install NodeJS and NPM and install dependencies
```
npm install
ionic cordova plugin
npm run start
```

### Features
 - Manage multiple GPS car trackers.
 - Store and list messages exchanged with the car tracker.
 - Export stored data as file.


### SMS Commands

| Command              | Function                                                     | Response    |
| -------------------- | :----------------------------------------------------------- | ----------- |
| admin[pw] [phone]    | Set the admin phone number                                   | admin ok    |
| apn[pw] [value]      | Set the APN value for the SIM card carrier                   | apn ok      |
| password[pw] [newpw] | Change the password of the device, by default the password is 123456. | password ok |
| zone[pw] [zone]      | Set the time zone of the SMS tracker.                        |             |
| speed[pw] [speed]    | Set the speed alarm value to reset the value set the speed to 0. |             |
| move[pw] [distance]  | Set the movement alarm distance value (in meters).           |             |
| nomove[pw]           | Disable the movement alarm.                                  |             |
| g1234                | Get the location of the tracker, car velocity, date and ACC status |             |
| 10[n]#[phone]#       | Set SOS phone number slot n. Slots from 1 to 3 available.    | ok          |
| D10[n]#[phone]#      | Delete SOS phone number on slot n.                           |             |
| C10#                 | List the SOS phone numbers registered in the device.         |             |

### SMS Responses
 - Sometimes the GPS tracker sends some responses to the admin number here are some of these values
 

### Libraries
 - https://ionicframework.com/docs/v3/native/sms/
 - https://www.npmjs.com/package/cordova-plugin-sms-receive


### Cordova
 - You can replace icon.png and splash.png.
 - Run `ionic cordova resources` to generate icon and splash screen sizes.


### License
- This project is distributed under MIT license. (Available on the project Git repository on GitHub).
