import {Mockup} from './mockup';

/**
 * Mockup objet to simulate the behavior of the GT-901 GPS tracker supports only some of the SMS commands for layout testing purpose.
 */
export class Gt901Mockup implements Mockup{
    /**
     * Method used to return SMS responses to the application, receives the parameters (message, phoneNumber).
     */
    public onSMSResponse: Function = null;

    constructor(onSMSResponse: Function) {
        this.onSMSResponse = onSMSResponse;

        console.log('CarTracker: GT-901 mockup created.');
    }

    public id: string = '0000000000';
    public iccid: string  = '00000000000000000000';
    public password: string = '123456';
    public admin: string = '';
    public apn: string = '';
    public speed: string = '';
    public sleep: string = '';
    public zone: string = '';
    private battery: string = '5';

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

        if(message.search(new RegExp('admin' + this.password + ' ([0-9a-zA-Z])+')) > 0) {
            this.respondSMS('admin ok', phoneNumber);
        } else if(message.search(new RegExp('apn' + this.password + ' ([0-9a-zA-Z])+')) > 0) {
            // TODO <Set apn>
            this.respondSMS('apn ok', phoneNumber);
        } else if (message.search(new RegExp('password' + this.password + ' ([0-9a-zA-Z])+')) > 0) {
            // TODO <Set password>
            this.respondSMS('password ok', phoneNumber);
        } else if (message.search(new RegExp('speed' + this.password + ' ([0-9])+')) > 0) {
            // TODO <Set speed>
            this.respondSMS('speed ok', phoneNumber);
        } else if (message.search(new RegExp('zone' + this.password + ' ([A-Z]+[0-9])+')) > 0) {
            // TODO <Set zone>
            this.respondSMS('ok', phoneNumber);
        } else if (message.search(new RegExp('sleep,' + this.password + ',([0-9])+')) > 0) {
            // TODO <Set sleep>
            this.respondSMS('ok', phoneNumber);
        } else if (message.search(new RegExp('accclock,' + this.password + ',(0|1)')) > 0) {
            // TODO <Set accclock>
        } else if (message.search(new RegExp('pwrsms' + this.password + ',(0|1)')) > 0) {
            // TODO <Set pwrsms>
        } else if (message.search(new RegExp('pwrcall' + this.password + ',(0|1)')) > 0) {
            // TODO <Set pwrcall>
        } else if (message === 'g1234') {
            const speed = (Math.random() * 120).toFixed(2);
            const n = (Math.random() * 180).toFixed(5);
            const w = (Math.random() * 180).toFixed(5);
            const acc = 'OFF';
            const date = new Date();
            const time = date.getUTCDay() + '-' + date.getUTCMonth() + '-' + date.getUTCFullYear() + ' ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds();
            this.respondSMS('http://maps.google.cn/maps?q=N' + n + '%2cW' + w + '\nID:' + this.id + '\nACC:' + acc + '\nGPS:A\nSpeed:' + speed + 'KM/H\n' + time, phoneNumber);
        } else if (message === 'CXZT') {
            this.respondSMS('XM_GT09_SW_33.0 2019/08/08\nID:' + this.id + '\nIP:27.aika168.com 8185\nBAT:' + this.battery + '\nAPN:' + this.apn + '\nGPS:V-13-9\nGSM:22\nICCID:' + this.iccid, phoneNumber);
        } else if (message === '109#') {
            // TODO <Set language>
            this.respondSMS('ok', phoneNumber);
        } else if (message === 'format') {
            this.respondSMS('恢复出厂值成功，请从新绑定车主号码!', phoneNumber)
        } else {
            this.respondSMS('指令格式错误', phoneNumber);
        }
    }
}