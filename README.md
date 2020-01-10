# CarTracker
 - Mobile application to track car GPS position for SMS based Chinese tracker marketed under the model number A11, ST-901, GT01 and GT09.
 - Works with Android due to native plugins compatibility.
 - May be compatible with other SMS based trackers, but it was only tested with this one.



### Setup

- Install [Java JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) and Android development SDK

 - Install [NodeJS](https://nodejs.org/en/) and NPM and install dependencies
```
npm install
npm run start
```



### Features

 - Manage multiple GPS car trackers.
 - Store and list messages exchanged with the car tracker.
 - Export stored data as file.



### SMS Commands

- Here is a list of all the commands that i have tested with the device alongside with the answers returned.

| Command                | Function                                                     | Response Example                                             |
| ---------------------- | :----------------------------------------------------------- | ------------------------------------------------------------ |
| admin[pw] [phone]      | Set the admin phone number used for the GPS to return information. | admin ok                                                     |
| apn[pw] [value]        | Set the APN value for the SIM card carrier                   | apn ok                                                       |
| password[pw] [newpw]   | Change the password of the device, by default the password is 123456. | password ok                                                  |
| g1234                  | Get the location of the tracker, car velocity, date and ACC status | http://maps.google.cn/maps?q=N40.93956%2cW008.53900<br/>ID:9171072755<br/>ACC:OFF<br/>GPS:A<br/>Speed:38.00KM/H<br/>19-12-30 03:20:08 |
| 10[n]#[phone]#         | Set SOS phone number slot n. Slots from 1 to 3 available.    | ok                                                           |
| D10[n]#                | Delete SOS phone number on slot n.                           | ok                                                           |
| C10#                   | List the SOS phone numbers registered in the device.         | 101#[Phone1] 102#[Phone2] 103#[Phone3]                       |
| CXZT                   | Get the tracker firmware version, identifier, battery level, APN configuration GPS status etc. | XM_GT09_SW_33.0 2019/08/08<br/>ID:9171072755<br/>IP:27.aika168.com 8185<br/>BAT:5<br/>APN:internet<br/>GPS:V-13-9<br/>GSM:22<br/>ICCID:89351060000852459823 |
| format                 | Format the GPS tracker back to its factory values            | 恢复出厂值成功，请从新绑定车主号码!                          |
| speed[pw] [speed]      | Set the speed alarm value to reset the value set the speed to 0. Speed should be represented with 3 integer digits. | speed ok                                                     |
| 109#                   | Toggle the language between chinese and english.             |                                                              |
| sleep,[pw],[sleep]     | Configure sleep mode/time of the tracker. (Cannot figure out the right way to use it). | ok                                                           |
| zone[pw] [zone]        | Set the time zone of the SMS tracker. (E02, E08, etc)        | ok                                                           |
| accclock,[pw],[0 or 1] | Enable/disable ignition auto security, used for thet tracker to send and SMS everytime the inginition is switched. |                                                              |
| 122#                   | Turn on shake call alarm                                     | -                                                            |
|                        |                                                              |                                                              |



### Generic SMS Responses

 - Sometimes the GPS tracker sends some responses to the admin number here are some of these values
 - For some of the function described above there might be some differences from tracker to tracker depending on the manufacturer.

| Message                                                      | Function                                              |
| ------------------------------------------------------------ | ----------------------------------------------------- |
| 您的设备掉主电报警，请关注!                                  | Device was powered off (disconnected from power).     |
| 指令格式错误                                                 | Unknown instruction                                   |
| 恢复出厂值成功，请从新绑定车主号码!                          | The factory reset is successful.                      |
| <http://maps.google.cn/maps><br/>ID:9171072755<br/>ACC:OFF<br/>GPS:V<br/>Speed:0 KM/H<br/>19-12-29 23:22:22 | Location message response when there is no GPS signal |



### Cordova

 - You can replace icon.png and splash.png assets and then regenerate resources,
 - Run `ionic cordova resources` to generate icon and splash screen sizes.




### License
- This project is distributed under MIT license. (Available on the project Git repository on GitHub).
