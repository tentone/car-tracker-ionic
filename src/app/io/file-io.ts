import {App} from '../app';

/**
 * File utils contains file manipulation utils.
 */
export class FileIo {
	/**
	 * Write a file to a blob and download it to the client.
	 *
	 * @param fname File name.
	 * @param data Data to be written into the file.
	 */
	static write(fname: string, data: any) {
		if (App.isMobile()) {
			App.chooser.getFile().then((file) => {
				if (file === undefined || file.name === 'canceled') {
					return;
				}

				console.log('Cartracker: Write file.', file);

				App.file.writeFile(file.uri, fname, data);
			});
		} else {
			if (typeof data === 'object') {
				data = JSON.stringify(data, null, '\t');
			}

			const blob = new Blob([data], {type: 'octet/stream'});

			const download = document.createElement('a');
			download.download = fname;
			download.href = window.URL.createObjectURL(blob);
			download.style.display = 'none';
			download.onclick = function () {
				// @ts-ignore
				document.body.removeChild(this);
			};
			document.body.appendChild(download);

			download.click();
		}
	}

	/**
	 * Open file chooser dialog receives onLoad callback, file filter, saveas.
	 *
	 * Save mode does not work inside the browser.
	 *
	 * The onLoad callback receives an array of files as parameter.
	 *
	 * @param onLoad onLoad callback that receives array of files choosen as parameter.
	 * @param filter File type filter.
	 */
	static read(onLoad: Function, filter?: string) {
		if (App.isMobile()) {
			App.chooser.getFile().then((file) => {
				if (file === undefined || file.name === 'canceled') {
					return;
				}

				console.log('Cartracker: Read file.', file);

				let data = new TextDecoder('utf-8').decode(file.data);
				if (onLoad !== undefined) {
					onLoad(data);
				}
			});
		} else {
			const chooser = document.createElement('input');
			chooser.type = 'file';
			chooser.style.display = 'none';
			document.body.appendChild(chooser);

			if (filter !== undefined) {
				chooser.accept = filter;
			}

			chooser.onchange = function (event) {
				if (chooser.files.length > 0) {
					let reader = new FileReader();
					reader.readAsText(chooser.files[0]);
					reader.onload = () => {
						if (onLoad !== undefined) {
							onLoad(reader.result);
						}
					};
				}
				document.body.removeChild(chooser);
			};

			chooser.click();
		}
	}

	/**
	 * Read file data from URL, using XHR request.
	 *
	 * @param fname File URL.
	 * @param sync If set to true or undefined the file is read syncronosly.
	 * @param responseType Type of response to be used for the XHR.
	 * @param onLoad On load callback.
	 * @param onProgress On progress callback.
	 * @param onError On error callback.
	 * @return Data read if in sync mode.
	 */
	static readPath(fname: string, sync: boolean, responseType?, onLoad?: any, onProgress?: any, onError?: any) {
		if (sync === undefined) {
			sync = true;
		}

		const file = new XMLHttpRequest();
		file.overrideMimeType('text/plain');
		file.open('GET', fname, !sync);

		if (responseType !== undefined) {
			file.responseType = responseType;
		}

		if (onLoad !== undefined) {
			file.onload = function () {
				onLoad(file.response);
			};
		}

		if (onProgress !== undefined) {
			file.onprogress = onProgress;
		}
		if (onError !== undefined) {
			file.onerror = onError;
		}

		file.send(null);

		return sync === true ? file.response : null;
	}

	/**
	 * Get file name without extension from file path string.
	 *
	 * If input is a/b/c/abc.d output is abc.
	 *
	 * @param file File path
	 * @return File name without path and extension
	 */
	static getFileName(file: (File | string)) {
		if (file !== undefined) {

			if (file instanceof File) {
				file = file.name;
			}

			const a = file.lastIndexOf('\\');
			const b = file.lastIndexOf('/');

			return file.substring((a > b) ? (a + 1) : (b + 1), file.lastIndexOf('.'));
		}

		return '';
	}

	/**
	 * Get file extension from file path string.
	 *
	 * If input is a/b/c/abc.d output is d.
	 *
	 * @param file File path
	 * @return File extension
	 */
	static getFileExtension(file: (File | string)) {
		if (file !== undefined) {

			if (file instanceof File) {
				file = file.name;
			}

			return file.substring(file.lastIndexOf('.') + 1, file.length);
		}

		return '';
	}
}


