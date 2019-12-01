import {TranslateService} from '@ngx-translate/core';
import {LocaleEN} from './locale-en';

/**
 * Handles locales related tasks, locale data is registered here.
 */
export class Locale {
	public static translate: TranslateService;

	/**
	 * List of available translation maps.
	 */
	public static translations = new Map();

	/**
	 * Locale code in use currently.
	 */
	static code: string;

	public static initialize(translate: TranslateService) {
		this.code = 'en';

		this.translate = translate;
		this.translate.setDefaultLang(this.code);

		Locale.setTranslation('en', LocaleEN);
		Locale.use('en');
	}

	/**
	 * Register a locale object, that contains translation for a specific code.
	 *
	 * @param code Locale code to be used.
	 * @param obj Object that contains the translation data.
	 */
	public static setTranslation(code: string, obj: any) {
		if (this.translations.has(code)) {
			throw new Error('Translation code already exists.');
		}

		this.translations[code] = obj;
		this.translate.setTranslation(code, obj);
	}

	/**
	 * Set the locale to be used by code.
	 *
	 * @param code Locale code to be used.
	 */
	public static use(code: string) {
		this.code = code;
		this.translate.use(this.code);
	}

	/**
	 * Get a translation entry from the service.
	 *
	 * @param key Name of the entry to be fetched.
	 */
	public static get(key: string) {
		return this.translations[this.code][key];
	}

	/**
	 * List of possible locale codes.
	 */
	public static list() {
		return Array.from(this.translations.keys());
	}
}
