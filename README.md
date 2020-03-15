# CarTracker
 - Mobile application to track car GPS position for SMS based Chinese tracker marketed under the model number A11, ST-901, GT01 and GT09.
 - Works with Android due to ionic native plugins compatibility.
 - May be compatible with other SMS based trackers, but it was only tested with this one.

![front](https://raw.githubusercontent.com/tentone/cartracker/master/readme/front.jpg)![back](https://raw.githubusercontent.com/tentone/cartracker/master/readme/back.jpg)



### Setup

- Install [Java JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) and Android development SDK

 - Install [NodeJS](https://nodejs.org/en/) and NPM and install dependencies
```
npm install
npm run start
```



### Features

 - Manage multiple GPS car trackers.
 - Set multiple parameter of the tracker (speed limit, sleep time, password, distance alarm, etc)
 - Manage and list messages exchanged with the car tracker.
 - Export stored data as file for backup as JSON.



### Screenshots

<img src="https://raw.githubusercontent.com/tentone/cartracker/master/readme/screenshots/1.png" width="100">

<img src="https://raw.githubusercontent.com/tentone/cartracker/master/readme/screenshots/2.png" width="100">

<img src="https://raw.githubusercontent.com/tentone/cartracker/master/readme/screenshots/3.png" width="100">

<img src="https://raw.githubusercontent.com/tentone/cartracker/master/readme/screenshots/4.png" width="100">



### SMS Commands

- Here is a list of all the commands that i have tested with the device alongside with the answers returned.

| Command                | Function                                                     | Response Example                                             |
| ---------------------- | :----------------------------------------------------------- | ------------------------------------------------------------ |
| admin[pw] [phone]      | Set the admin phone number used for the GPS to return information. | admin ok                                                     |
| apn[pw] [value]        | Set the APN value for the SIM card carrier                   | apn ok                                                       |
| password[pw] [newpw]   | Change the password of the device, by default the password is 123456. | password ok                                                  |
| g1234                  | Get the location of the tracker, car velocity, date and ACC status | http://maps.google.cn/maps?q=N40.93956,W008.53900 ID:9171072755 ACC:OFF GPS:A Speed:38.00KM/H 19-12-30 03:20:08 |
| 10[n]#[phone]#         | Set SOS phone number slot n. Slots from 1 to 3 available.    | ok                                                           |
| D10[n]#                | Delete SOS phone number on slot n.                           | ok                                                           |
| C10#                   | List the SOS phone numbers registered in the device.         | 101#[Phone1] 102#[Phone2] 103#[Phone3]                       |
| CXZT                   | Get the tracker firmware version, identifier, battery level, APN configuration GPS status etc. | XM_GT09_SW_33.0 2019/08/08 ID:9171072755 IP:27.aika168.com 8185 BAT:5 APN:internet GPS:V-13-9 GSM:22 ICCID:89351060000852459823 |
| format                 | Format the GPS tracker back to its factory values            | 恢复出厂值成功，请从新绑定车主号码!                          |
| speed[pw] [speed]      | Set the speed alarm value to reset the value set the speed to 0. Speed should be represented with 3 integer digits. | speed ok                                                     |
| 109#                   | Toggle the language between chinese and english.             | ok                                                           |
| sleep,[pw],[sleep]     | Configure sleep mode/time of the tracker. (Cannot figure out the right way to use it). | ok                                                           |
| zone[pw] [zone]        | Set the time zone of the SMS tracker. (E02 means, E08, etc)  | ok                                                           |
| accclock,[pw],[0 or 1] | Enable/disable ignition auto security, used for the tracker to send an SMS every time the ignition is switched. | -                                                            |
| pwrsms[pw],[0 or 1]    | Enable/disable power SMS alarm sent if the alarm is disconnected from power. | -                                                            |
| pwrcall[pw],[0 or 1]   | Enable/disable power call made by the tracker warning that it was disconnected from power. | -                                                            |
| 12[n]#                 | Enable/disable shake call alarm (2 to enable, and 1 to disable). | -                                                            |
| 12[n]#                 | Enable/disable SMS alarm (5 to enable and 6 to disable).     | -                                                            |



### SMS Responses

 - Sometimes the GPS tracker sends some responses that may differ from the expected due to malformation in the command send.

| Message                                                      | Function                                          |
| ------------------------------------------------------------ | ------------------------------------------------- |
| 您的设备掉主电报警，请关注!                                  | Device was powered off (disconnected from power). |
| 指令格式错误                                                 | Unknown instruction                               |
| http://maps.google.cn/maps ID:9171072755 ACC:OFF GPS:V Speed:0 KM/H 19-12-29 23:22:22 | M                                                 |



### Cordova

 - You can replace icon.png and splash.png assets and then regenerate resources,
 - Run `ionic cordova resources` to generate icon and splash screen sizes.




### License
- This project is distributed under MIT license. (Available on the project Git repository on GitHub).
