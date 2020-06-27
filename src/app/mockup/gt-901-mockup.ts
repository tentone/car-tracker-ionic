import {Mockup} from './mockup';

/**
 * Mockup object to simulate the behavior of the GT-901 GPS tracker supports only some of the SMS commands for layout testing purpose.
 */
export class Gt901Mockup implements Mockup{
    /**
     * Method used to return SMS responses to the application, receives the parameters (message, phoneNumber).
     */
    public onSMSResponse: Function = null;

    public id: string;
    public iccid: string ;
    public password: string;
    public admin: string;
    public sosNumbers: string[];
    public apn: string;
    public speed: string;
    public sleep: string;
    public zone: string;
    public ignitionAlert: boolean;
    public battery: string;
    public powerLossSms: boolean;
    public powerLossCall: boolean;

    public gsmChannel: number;
    public gpsConfig: string;
    public server: string;

    constructor(onSMSResponse: Function) {
        this.onSMSResponse = onSMSResponse;
        this.reset();
        console.log('CarTracker: GT-901 mockup created.');
    }

    /**
     * Set default values on the GPS tracker.
     */
    public reset() {
        this.id = '0000000000';
        this.iccid  = '00000000000000000000';
        this.password = '123456';
        this.admin = '';
        this.apn = 'internet';
        this.speed = '-1';
        this.sleep = '-1';
        this.zone = 'E08';
        this.ignitionAlert = false;
        this.battery = '5';
        this.powerLossSms = false;
        this.powerLossCall = false;
        this.sosNumbers = ['', '', ''];
        this.gsmChannel = 22;
        this.gpsConfig = 'A-16-13';
        this.server = '27.aika168.com 8185';
    }

    /**
     * Method used to respond to SMS received from the application.
     *
     * @param message Message to be sent to the application.
     * @param phoneNumber Origin phone number of the SMS message.
     */
    public respondSMS(message: string, phoneNumber: string) {
        console.log('CarTracker: GT-901 mockup respond SMS.', message);

        setTimeout(() => {
            if (this.onSMSResponse !== null) {
                this.onSMSResponse(message, phoneNumber);
            }
        }, Math.random() * 1000 + 1000);
    }

    /**
     * Send message to the mock device.
     *
     * @param message Message content.
     * @param phoneNumber Destination phone number of the SMS.
     */
    public sendSMS(message: string, phoneNumber: string) {
        console.log('CarTracker: GT-901 mockup received SMS.', message, phoneNumber);

        // Position
        if (message === 'g1234') {
            const speed = (Math.random() * 120).toFixed(2);
            const n = (Math.random() * 90).toFixed(5);
            const w = (Math.random() * 180).toFixed(5);
            const acc = 'OFF';
            const gps = 'A';
            const date = new Date();
            const year = date.getFullYear().toString().substr(2, 2);
            const time = year + '-' + date.getUTCMonth() + '-' + date.getUTCDay() + ' ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds();
            this.respondSMS('http://maps.google.cn/maps?q=N' + n + ',W' + w + ' ID:' + this.id + ' ACC:' + acc + ' GPS:' + gps + ' Speed:' + speed + 'KM/H ' + time, phoneNumber);
            return;
        }

        // Information
        if (message === 'CXZT') {
            this.respondSMS('XM_GT09_SW_33.0 2019/08/08 ID:' + this.id + ' IP:' + this.server + ' BAT:' + this.battery + ' APN:' + this.apn + ' GPS:' + this.gpsConfig + ' GSM:' + this.gsmChannel + ' ICCID:' + this.iccid, phoneNumber);
            return;
        }

        // Set admin phone number
        const adminRegex = new RegExp('admin' + this.password + ' ([0-9a-zA-Z]+)');
        if(message.search(adminRegex) > -1) {
            this.admin = message.match(adminRegex)[1];
            this.respondSMS('admin ok', phoneNumber);
            return;
        }

        // Set APN
        const apnRegex = new RegExp('apn' + this.password + ' ([0-9a-zA-Z]+)');
        if(message.search(apnRegex) > -1) {
            this.apn = message.match(apnRegex)[1];
            this.respondSMS('apn ok', phoneNumber);
            return;
        }

        // Change password
        const passwordRegex = new RegExp('password' + this.password + ' ([0-9a-zA-Z]+)');
        if (message.search(passwordRegex) > -1) {
            this.password = message.match(passwordRegex)[1];
            this.respondSMS('password ok', phoneNumber);
            return;
        }

        // Speed limit
        const speedRegex = new RegExp('speed' + this.password + ' ([0-9]+)');
        if (message.search(speedRegex) > -1) {
            this.speed = message.match(speedRegex)[1];
            this.respondSMS('speed ok', phoneNumber);
            return;
        }

        // Set time zone
        const zoneRegex = new RegExp('zone' + this.password + ' ([A-Z]+[0-9]+)');
        if (message.search(zoneRegex) > -1) {
            this.speed = message.match(zoneRegex)[1];
            this.respondSMS('ok', phoneNumber);
            return;
        }

        // Set sleep time
        const sleepRegex = new RegExp('sleep,' + this.password + ',([0-9]+)');
        if (message.search(sleepRegex) > -1) {
            this.sleep = message.match(sleepRegex)[1];
            this.respondSMS('ok', phoneNumber);
            return;
        }

        // Ignition alert
        const accRegex = new RegExp('accclock,' + this.password + ',(0|1)');
        if (message.search(accRegex) > -1) {
            this.ignitionAlert = message.match(accRegex)[1] === '1';
            return;
        }

        // Power loss SMS
        const pwrSmsRegex = new RegExp('pwrsms' + this.password + ',(0|1)');
        if (message.search(pwrSmsRegex) > -1) {
            this.powerLossSms = message.match(pwrSmsRegex)[1] === '1';
            return;
        }

        // Power loss call
        const pwrCallRegex = new RegExp('pwrcall' + this.password + ',(0|1)');
        if (message.search(pwrCallRegex) > -1) {
            this.powerLossCall = message.match(pwrCallRegex)[1] === '1';
            return;
        }

        // Toggle language
        if (message === '109#') {
            this.respondSMS('ok', phoneNumber);
            return;
        }

        // Format device
        if (message === 'format') {
            this.reset();
            this.respondSMS('恢复出厂值成功，请从新绑定车主号码!', phoneNumber);
            return;
        }

        // Set SOS number
        const sosNumberRegex = new RegExp('10(1|2|3)#([0-9a-zA-Z]+)#');
        if (message.search(sosNumberRegex) > -1) {
            let matches = message.match(sosNumberRegex)
            let idx = Number.parseInt(matches[1], 10) - 1;
            this.sosNumbers[idx] = matches[2];
            this.respondSMS('ok', phoneNumber);
            return;
        }

        // Delete SOS number
        const deleteSosNumberRegex = new RegExp('D10(1|2|3)#');
        if (message.search(deleteSosNumberRegex) > -1) {
            let idx = Number.parseInt(message.match(deleteSosNumberRegex)[1], 10) - 1;
            this.sosNumbers[idx] = '';
            this.respondSMS('ok', phoneNumber);
            return;
        }

        // List SOS numbers
        if (message === 'C10#') {
            let msg = '';
            for (let i = 0; i < this.sosNumbers.length; i++) {
                msg += '10' + (i + 1) + '#' + this.sosNumbers[i];
            }
            this.respondSMS(msg, phoneNumber);
            return;
        }

        this.respondSMS('指令格式错误', phoneNumber);
    }
}
