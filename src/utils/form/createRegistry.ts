import { batch, onCleanup } from 'solid-js';
import type { FormController, Validation } from './types';
import { triggerValidation } from './utils';
import { formInner } from './createForm';

export type BaseField<T> = Readonly<{
	onChange:   (value: T) => void;
	value:      T
	errors:     string[] | undefined
	error:      string | undefined
	validate:   () => boolean
	validation: () => any
}>;

export type LooseBaseField<T> = BaseField<T> | BaseField<T | undefined>;

export function createBaseField<T extends object, K extends (keyof T) & string>(options: {
	form:        FormController<T, any>,
	name:        K,
	validation?: Validation<T[K]>,
}): BaseField<T[K]> {
	const validation = () => options.validation?.(options.form.values[options.name]);
	if (validation) options.form[formInner].validations[options.name] = validation;
	onCleanup(() => {
		delete options.form[formInner].validations[options.name];
	});
	const validate = () => {
		const success = triggerValidation(options.form, options.name, validation);
		if (success) options.form[formInner].setErrors(options.name, []);
		return success;
	};

	return {
		validation,
		validate,
		onChange: (value) => batch(() => {
			(options.form as any).setValues(options.name, value);
			if (!options.form.submitted) return;
			validate();
			options.form[formInner].checkTransform();
		}),
		get value() {
			return options.form.values[options.name];
		},
		get errors() {
			return options.form[formInner].errors?.[options.name];
		},
		get error() {
			return this.errors?.[0];
		},
	};
}

type CreateRegistry<T extends object> = <K extends (keyof T) & string>(
	name: K,
	validation?: Validation<T[K]>,
) => BaseField<T[K]>;

export function createRegistry<T extends object>(form: FormController<T>): CreateRegistry<T> {
	return (name, validation) => createBaseField({ form, name, validation });
}
