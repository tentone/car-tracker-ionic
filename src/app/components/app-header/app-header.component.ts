import {Component, Input} from '@angular/core';
import {App} from '../../app';

@Component({
	selector: 'app-header',
	templateUrl: './app-header.component.html'
})
export class AppHeaderComponent {
	/**
	 * Title to be displayed on the application header.
	 */
	@Input() title: string;

	/**
	 * Method used to open the action sheet.
	 */
	@Input() onAction: Function = null;

	get app() { return App; }
}
