import {AlertController, ToastController} from '@ionic/angular';
import {Locale} from './locale/locale';

/**
 * Handles the creating and display of modal boxes with messages for the user.
 *
 * Can be used for alerts, errors, warning, etc.
 */
export class Modal {
	/**
	 * Show alert box, with a title and data.
	 */
	public static async alert(title: string, message: string) {
		const controller = new AlertController();
		const alert = await controller.create({
			header: title,
			message: message.replace(/\n/g, '<br>'),
			buttons: [Locale.get('ok')]
		});

		await alert.present();
	}

	/**
	 * Show confirmation box, with a title and data.
	 *
	 * The user has to answer (yes or no), the response is received as boolean on the confirm callback.
	 */
	public static async confirm(title: string, message: string, onConfirm: Function) {
		const controller = new AlertController();
		const alert = await controller.create({
			header: title,
			message: message.replace(/\n/g, '<br>'),
			buttons: [
				{text: Locale.get('ok'), handler: () => { onConfirm(true); }},
				{text: Locale.get('cancel'), handler: () => { onConfirm(false); }}
			]
		});
		
		await alert.present();
	}

	/**
	 * Show confirmation box, with a title and data.
	 *
	 * The use can cancel the callback receives two values a confirm boolean value and a data with the data inserted into the box.
	 */
	public static async prompt(title: string, inputs: any[], onConfirm: Function) {
		const controller = new AlertController();
		const alert = await controller.create({
			header: title,
			inputs: inputs,
			buttons: [
				{text: Locale.get('ok'), handler: (data) => { onConfirm(true, data); }},
				{text: Locale.get('cancel'), handler: (data) => { onConfirm(false, data); }}
			]
		});

		await alert.present();
	}

	/**
	 * Show toast data.
	 */
	public static async toast(message: string, duration: number = 3000) {
		const controller = new ToastController();
		const toast = await controller.create({
			message: message.replace(/\n/g, '<br>'),
			duration: duration
		});
		await toast.present();
	}
}
