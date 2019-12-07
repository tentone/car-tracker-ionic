/**
 * URL utils class is used to manage URL data and URL processing.
 */
export class URLUtils {
	/**
	 * Get the query parameter from the browser URL.
	 *
	 * @return Object with parameters read from the URL.
	 */
	static getQueryParameters(): any {
		const values = location.search.substring(1).split('&');
		const parameters = {};

		// tslint:disable-next-line:prefer-for-of
		for (var i = 0; i < values.length; i++) {

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
	static encodeFormURL(json): string {
		var data = [];

		for (var i in json) {
			data.push(encodeURIComponent(i) + '=' + encodeURIComponent(json[i]));
		}

		return data.join('&').replace(/%20/g, '+');
	}
}
