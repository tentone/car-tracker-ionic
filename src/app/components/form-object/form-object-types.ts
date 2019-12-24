/**
 * Possible options for dynamic form entries.
 *
 * Form layout are declared in an array each element contains at least {type: number, attribute: string, label: string} values.
 */
export const FormObjectTypes = {
	/**
	 * Simple single line text option.
	 */
	TEXT: 0,

	/**
	 * Number input as text.
	 *
	 * Can include additional {unit: string} to specify a unit shown after the value.
	 */
	NUMBER: 1,

	/**
	 * Multi line text box, expands as the user inserts new lines.
	 */
	TEXT_MULTILINE: 2,

	/**
	 * Password text box, the text is hidden.
	 */
	PASSWORD: 3,

	/**
	 * Checkbox style boolean value.
	 */
	CHECKBOX: 4,

	/**
	 * Select one of many options of any data type.
	 *
	 * Has to include an additional options:[{label: string, value: any}, ...] in the object.
	 */
	OPTIONS: 5,

	/**
	 * Phone number, selectable from the device contacts.
	 */
	PHONE: 6,

};
