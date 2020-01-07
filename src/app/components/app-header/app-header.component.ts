import {Component, Input} from '@angular/core';
import {App} from '../../app';

@Component({
	selector: 'app-header',
	templateUrl: './app-header.component.html'
})
export class AppHeaderComponent {
	@Input() title: string;

	get app() { return App; }
}
