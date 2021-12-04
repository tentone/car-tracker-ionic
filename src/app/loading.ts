import {LoadingController} from '@ionic/angular';
import {Locale} from './locale/locale';
import {Environment} from '../environments/environment';

export class Loading {
	/**
	 * Loading controller used to create the loading box.
	 */
	static controller = new LoadingController();

	/**
	 * Loading box currently in display.
	 */
	static loading = null;

	/**
	 * Number of requests to show loading box, might be multiple calls waiting for load to finish.
	 */
	static count = 0;

	/**
	 * Show the loading box.
	 */
	public static show(): void {
		Loading.count++;

		if (!Environment.production) {
			console.log('Show loading.', Loading.count);
		}

		if (Loading.count === 1) {
			Loading.controller.create({
				message: Locale.get('loadingData'),
				spinner: 'crescent'
			}).then((result: HTMLIonLoadingElement) => {
				Loading.loading = result;

				if (Loading.count > 0) {
					Loading.loading.present();
				} else if (Loading.loading !== null) {
					Loading.loading.dismiss();
				}
			});
		}
	}

	/**
	 * Hide the loading box.
	 */
	public static hide(): void {
		Loading.count--;

		if (!Environment.production) {
			console.log('Hide loading.', Loading.count);
		}

		if (Loading.count === 0) {
			if (Loading.loading !== null) {
				Loading.loading.dismiss();
			}
		}
	}
}
