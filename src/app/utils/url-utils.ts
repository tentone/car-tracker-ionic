/**
 * URL utils class is used to manage URL data and URL processing.
 */
export class URLUtils {
	/**
	 * Get the query parameter from the browser URL.
	 *
	 * @return Object with parameters read from the URL.
	 */
	public static getQueryParameters(url?: string): any {
		if (url === undefined) {
			// Get URL from window location
			url = window.location.search.substring(1);
		} else {
			// Split URL and arguments
			const urls = url.split('?');
			if (urls.length > 1) {
				url = urls[1];
			}
		}

		const values = url.split('&');
		const parameters = {};

		// tslint:disable-next-line:prefer-for-of
		for (let i = 0; i < values.length; i++) {

			const pair = values[i].split('=');
			if (pair.length > 1) {
				const name = unescape(pair[0]).replace(new RegExp('"', 'g'), '');
				const value = unescape(pair[1]).replace(new RegExp('"', 'g'), '');
				parameters[name] = value;
			}
		}

		return parameters;
	}

	/**
	 * Generate form URL encoded data from JSON object.
	 *
	 * @param json Object to be encoded.
	 * @return Form like data to be sent to the server.
	 */
	public static encodeFormURL(json: any): string {
		let data = [];

		for (let i in json) {
			data.push(encodeURIComponent(i) + '=' + encodeURIComponent(json[i]));
		}

		return data.join('&').replace(/%20/g, '+');
	}
}
