import {Component, Input, OnChanges} from '@angular/core';
import {FormObjectTypes} from './form-object-types';
import {App} from '../../app';
import {Environment} from '../../../environments/environment';

@Component({
	selector: 'dynamic-form',
	templateUrl: 'form-object.component.html'
})
export class FormObjectComponent implements OnChanges {
	get dynamicForm() { return FormObjectTypes; }
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

			if (type === FormObjectTypes.TEXT || type === FormObjectTypes.TEXT_MULTILINE || type === FormObjectTypes.PASSWORD) {
				object[attribute] = '';
			} else if (type === FormObjectTypes.CHECKBOX) {
				object[attribute] = false;
			} else if (type === FormObjectTypes.NUMBER) {
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
				type = FormObjectTypes.TEXT;
			} else if (typeof object[i] === 'number') {
				type = FormObjectTypes.NUMBER;
			} else if (typeof object[i] === 'boolean') {
				type = FormObjectTypes.CHECKBOX;
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

		for (var i = 0; i < this.layout.length; i++) {

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
	 * @param attribute Name of the attribute in the object.
	 * @param value New value to be set.
	 */
	public setAttribute(object: any, attribute: string, value: any) {
		try  {
			let attrs = attribute.split('.');
			let sub = object;
			let i;

			for (i = 0; i < attrs.length - 1; i++) {
				sub = sub[attrs[i]];
			}

			sub[attrs[i]] = value;
		} catch (e) {
			if (!Environment.production) {
				// console.error('Error form setAttribute', object, attribute, sub, attrs, value);
			}
		}
	}

	/**
	 * Get attribute of an object to display in the form.
	 *
	 * @param object Object being edited.
	 * @param attribute Name of the attribute in the object.
	 */
	public getAttribute(object: any, attribute: string): any {
		try  {
			const attrs = attribute.split('.');
			let value = object;

			for (let i = 0; i < attrs.length; i++) {
				value = value[attrs[i]];
			}

			return value;
		} catch (e) {
			if (!Environment.production) {
				// console.log('Form getAttribute', object, attribute, value);
			}
		}

		return null;
	}

	/**
	 * Check if a specific field of an object is empty.
	 *
	 * @param object Object being edited.
	 * @param row Name of the attribute in the object.
	 * @return True if the field is empty false otherwise.
	 */
	public fieldEmpty(object: any, row: any) {
		let value = this.getAttribute(object, row.attribute);

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
}
