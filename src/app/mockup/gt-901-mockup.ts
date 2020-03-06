/**
 * Mockup objet to simulate the behavior of the GT-901 GPS tracker supports only some of the SMS commands for layout testing purpose.
 */
class Gt901Mockup {
    public static onSMSResponse: Function;

    public static id: string = '9171072755';
    public static password: string = '123456';
    public static admin: string = '';
    public static apn: string = '';

    public static respondSMS(message: string) {

    }

    public static sendSMS(message: string, phoneNumber: string) {
        setTimeout(() => {
            if(message.search(new RegExp('admin' + this.password + ' ([0-9a-zA-Z])+')) > 0) {
                this.respondSMS('admin ok');
            } else if(message.search(new RegExp('apn' + this.password + ' ([0-9a-zA-Z])+')) > 0) {
                this.respondSMS('apn ok');
            } else if (message.search(new RegExp('password' + this.password + ' ([0-9a-zA-Z])+')) > 0) {
                this.respondSMS('password  ok');
            } else if (message === 'g1234') {
                const speed = (Math.random() * 120).toFixed(2);
                const n = (Math.random() * 180).toFixed(5);
                const w = (Math.random() * 180).toFixed(5);
                const acc = 'OFF';

                this.respondSMS('http://maps.google.cn/maps?q=N40.93956%2cW008.53900\nID:' + this.id + '\nACC:' + acc + '\nGPS:A\nSpeed:' + speed + 'KM/H\n19-12-30 03:20:08');
            }else {
                this.respondSMS('指令格式错误');
            }
        }, Math.random() * 5000 + 3000);
    }

}
