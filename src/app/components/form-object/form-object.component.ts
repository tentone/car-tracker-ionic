import {Component, Input, OnChanges} from '@angular/core';
import {FormObjectType} from './form-object-type';
import {App} from '../../app';
import {Environment} from '../../../environments/environment';

@Component({
	selector: 'form-object',
	templateUrl: 'form-object.component.html'
})
export class FormObjectComponent implements OnChanges {
	get types() { return FormObjectType; }
	get app() { return App; }

	/**
	 * Layout of the dynamic form, is an array of form entry descriptions.
	 *
	 * Each field has the attribute name, label, type of data and additional type specific elements.
	 *
	 * e.g. [{label: abc, attribute: something, type: DynamicFormTypes.TEXT}]
	 */
	@Input() layout: any[] = null;

	/**
	 * Object being edited in the dynamic form.
	 */
	@Input() object: any = null;

	/**
	 * Callback method called when the object changes, receives the (object, attribute, oldValue, newValue) parameters.
	 */
	@Input() onChange: Function = null;

	/**
	 * Indicates if the form fields are editable or view only.
	 */
	@Input() editable: boolean = true;

	/**
	 * Check for changes in the layout object and create one if necessary.
	 */
	public ngOnChanges(): void {
		if (this.layout === null && this.object !== null) {
			this.layout = FormObjectComponent.createLayout(this.object);
		}
	}

	/**
	 * Create object to match the layout specified.
	 *
	 * @param layout Form layout.
	 */
	public static createObject(layout: any[]): any {
		let object = {};

		for (let i = 0; i < layout.length; i++) {

			let attribute = layout[i].attribute;
			if (attribute === undefined) {
				continue;
			}

			let type = layout[i].type;

			if (type === FormObjectType.TEXT || type === FormObjectType.TEXT_MULTILINE || type === FormObjectType.PASSWORD) {
				object[attribute] = '';
			} else if (type === FormObjectType.CHECKBOX) {
				object[attribute] = false;
			} else if (type === FormObjectType.NUMBER) {
				object[attribute] = 0;
			} else {
				object[attribute] = null;
			}
		}

		return object;
	}

	/**
	 * Create a generic layout for a javascript object using the base fields.
	 *
	 * @param object Object to create the layout for.
	 * @return Layout object to use for the form.
	 */
	public static createLayout(object: any): any[] {
		const layout = [];

		for (let i in object) {
			let type = null;

			if (typeof object[i] === 'string') {
				type = FormObjectType.TEXT;
			} else if (typeof object[i] === 'number') {
				type = FormObjectType.NUMBER;
			} else if (typeof object[i] === 'boolean') {
				type = FormObjectType.CHECKBOX;
			}

			if (type !== null) {
				layout.push({
					attribute: i,
					type: type
				});
			}
		}

		return layout;
	}

	/**
	 * Check if all required fields are filled, does not check if the field data is valid.
	 */
	public requiredFilled(): boolean {
		for (let i = 0; i < this.layout.length; i++) {

			// Ignore inactive layout rows
			if (this.layout[i].isActive !== undefined && !this.layout[i].isActive(this.object, this.layout[i])) {
				continue;
			}

			if (this.layout[i].required === true) {
				if (this.fieldEmpty(this.object, this.layout[i])) {
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * Set the attribute of an object to a new value.
	 *
	 * Attribute names can indicate nested objects (e.g. a:{b:{c:2}} the c value can be accessed as "a.b.c").
	 *
	 * @param object Object being edited.
	 * @param row Row of the layout.
	 * @param value New value to be set.
	 */
	public setAttribute(object: any, row: any, value: any) {
		try  {
			let attrs = row.attribute.split('.');
			let sub = object;
			let i;

			for (i = 0; i < attrs.length - 1; i++) {
				sub = sub[attrs[i]];
			}

			if (this.onChange !== null) {
				this.onChange(object, row.attribute, sub[attrs[i]], value);
			}

			if (row.onChange !== null) {
				row.onChange(object, row.attribute, sub[attrs[i]], value);
			}

			sub[attrs[i]] = value;
		} catch (e) {
			if (!Environment.production) {
				console.warn('CarTracker: Error assigning form attribute.', object, row);
			}
		}
	}

	/**
	 * Get attribute of an object to display in the form.
	 *
	 * @param object Object being edited.
	 * @param row Row of the layout.
	 */
	public getAttribute(object: any, row: any): any {
		try  {
			const attrs = row.attribute.split('.');
			let value = object;

			for (let i = 0; i < attrs.length; i++) {
				value = value[attrs[i]];
			}

			return value;
		} catch (e) {
			if (!Environment.production) {
				console.warn('CarTracker: Error getting form attribute.', object, row);
			}
		}

		return null;
	}

	/**
	 * Check if a specific field of an object is empty.
	 *
	 * @param object Object being edited.
	 * @param row Row of the layout for the attribute.
	 * @return True if the field is empty false otherwise.
	 */
	public fieldEmpty(object: any, row: any) {
		let value = this.getAttribute(object, row);

		if (row.isEmpty !== undefined) {
			return row.isEmpty(object, row);
		}

		if (value === null || value === undefined) {
			return true;
		} else if (typeof value === 'string') {
			return value.length === 0;
		}

		return false;
	}

	/**
	 * Select a contact from the system contact manager.
	 *
	 * @param object Object to store the result into.
	 * @param row Row of the layout for the attribute.
	 */
	public selectContact(object: any, row: any) {
		App.contacts.pickContact().then((data) => {
			if (data.phoneNumbers.length > 0) {
				this.setAttribute(object, row, data.phoneNumbers[0].value);
			}
		});
	}
}
