# CarTracker
 - Mobile application to track car GPS position for SMS based Chinese tracker(s) marketed under the model number A11, ST-901, GT01 and GT09.
 - Manage multiple GPS car trackers using SMS communication.
 - Set multiple parameter of the tracker (e.g. speed limit, sleep time, password, distance alarm)
 - Manage and list messages exchanged with the car tracker.
 - Export stored data as file for backup as JSON.
 - Dark and bright graphical user interface themes (including maps).
 - Mockup of the ST-901 device that can be used for development testing on the browser.
 - Works with any Ionic compatible platform (may have problems on some platforms caused ionic native plugins compatibility).
 - May be compatible with other SMS based trackers, but it was only tested with these mentioned above.

<img src="https://raw.githubusercontent.com/tentone/cartracker/master/readme/front.jpg" width="300"><img src="https://raw.githubusercontent.com/tentone/cartracker/master/readme/back.jpg" width="300"><img src="https://raw.githubusercontent.com/tentone/cartracker/master/readme/pcb.jpg" width="300">



### Screenshots

<img src="https://raw.githubusercontent.com/tentone/cartracker/master/readme/screenshots/1.png" width="180"><img src="https://raw.githubusercontent.com/tentone/cartracker/master/readme/screenshots/2.png" width="180"><img src="https://raw.githubusercontent.com/tentone/cartracker/master/readme/screenshots/3.png" width="180"><img src="https://raw.githubusercontent.com/tentone/cartracker/master/readme/screenshots/4.png" width="180">



### Development Environment

- Install [Java JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) and [Android development SDK](https://developer.android.com/studio#downloads), there is no need to install the Android Studio IDE, only the build tools are required.
  - You may need to install [gradle](https://gradle.org/) [manually](https://gradle.org/install/#manually) and register it in your path.
- Ensure that you have the environment variables `GRADLE_HOME`, `JAVA_HOME` and `ANDROID_SDK_ROOT`, and have access to `java` and `gradle` from the your terminal (or command line in windows).
  - `GRADLE_HOME` ...\Gradle\gradle-7.2
  - `JAVA_HOME` ...\Java\jdk1.8.0_301
  - `ANDROID_SDK_ROOT` ...\AppData\Local\Android\Sdk
- Install Android SDK Platform 28 tools from the android SDK manager.
- Install [NodeJS](https://nodejs.org/en/) and NPM and install dependencies

```bash
npm install -g @ionic/cli
npm install
npm run start
```

- The application can be built using Ionic Native for mobile devices using [Cordova](https://cordova.apache.org/) or [Capacitor](https://capacitorjs.com/), by default capacitor is used.



### Capacitor

- TODO



### Cordova

 - You can replace `icon.png`  assets and then regenerate resources by running  `ionic cordova resources` to generate icon and splash screen sizes.
 - To add platforms to the project run `cordova platform add <platform>` and to remove `cordova platform remove <platform>`
- To run the application run `cordova run <platform>`.
- If any errors occurs regarding `dx.bat` file open android sdk Directory and copy `d8.bat` as `dx.bat`



### SMS Commands

- Here is a list of all the commands that i have tested with the device alongside with the answers returned by the GPS tracker.

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
| 109#                   | Toggle the language between Chinese and English.             | ok                                                           |
| sleep,[pw],[sleep]     | Configure sleep time (in minutes) of the tracker. 0 means no sleep. | ok                                                           |
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




### License
- This project is distributed under MIT license. (Available on the project Git repository on GitHub).
