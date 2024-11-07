import * as v from 'valibot';

type FormStringSchema = v.SchemaWithPipe<[v.StringSchema<string>, v.MinLengthAction<string, 0, string>, v.MaxLengthAction<string, 255, 'Maksymalna długośc to 255 znaków'>]>;

export function formString(
	message: string = 'Pole wymagane',
): FormStringSchema {
	return v.pipe(
		v.string(message),
		v.minLength(0, message),
		v.maxLength(255, 'Maksymalna długośc to 255 znaków'),
	);
}