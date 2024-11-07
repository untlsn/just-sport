import { TextField } from '@kobalte/core/text-field';
import * as V from 'valibot';
import * as F from '~/utils/form';
import { registerUserAction } from '~/server/auth';
import { useAction, useSubmission } from '@solidjs/router';
import { Match, Switch } from 'solid-js';

const reqString = V.pipe(V.string('Pole wymagane'), V.minLength(1, 'Pole wymagane'));

const FormSchema = V.pipe(
	V.object({
		name:           reqString,
		email:          V.pipe(reqString, V.email('Email nie jest prawidłowy')),
		password:       V.pipe(reqString, V.minLength(6, 'Hasło musi mieć przynajmniej 6 znaków')),
		repeatPassword: V.pipe(reqString, V.minLength(6, 'Hasło musi mieć przynajmniej 6 znaków')),
	}),
	V.forward(V.partialCheck(
		[['password'], ['repeatPassword']],
		(input) => input.password == input.repeatPassword,
		'Hasła muszą być takie same',
	), ['password']),
);

export default function ThePage(): JSXElement {

	const registerUser = useAction(registerUserAction);
	const userRegistering = useSubmission(registerUserAction);

	const form = F.createForm({
		...F.satisfiesSchema(FormSchema, {}),
		onSubmit(payload) {
			return registerUser(payload);
		},
	});

	const register = F.createRegistry(form);

	return (
		<main class="grid place-items-center min-h-screen">
			<form
				onSubmit={form.submit}
				class="shadow-lg rounded-lg border p-4 text-center space-y-4 w-120 max-w-95vw"
			>
				<h1 class="text-8">
					Rejestracja
				</h1>
				<PageTextField {.../*@once*/register('name')} label="Imie i nazwisko" />
				<PageTextField {.../*@once*/register('email')} label="Email" />
				<PageTextField {.../*@once*/register('password')} label="Hasło" type="password" />
				<PageTextField {.../*@once*/register('repeatPassword')} label="Powtórz hasło" type="password" />
				<Switch fallback={(
					<button
						type="submit"
						class="bg-gradient-to-b from-primary-5 to-primary-1 text-white rounded px-4 py-2 text-4"
					>
						Zarejestruj się
					</button>
				)}
				>
					<Match when={userRegistering.pending}>
						<span
							class="bg-gradient-to-b from-primary-5 to-primary-1 text-white rounded px-4 py-2 text-4"
						>
							<i class="i-line-md-loading-alt-loop" />
						</span>
					</Match>
					<Match when={userRegistering.result}>
						<span
							class="bg-gradient-to-b from-primary-5 to-primary-1 text-white rounded px-4 py-2 text-4"
						>
							Zarejestrowano!
						</span>
					</Match>
				</Switch>

			</form>
		</main>
	);
}

function PageTextField(props: { label: string, type?: string } & F.LooseBaseField<string>): JSXElement {
	return (
		<TextField
			class="relative pt-2"
			value={props.value}
			onChange={props.onChange}
			validationState={props.error ? 'invalid' : 'valid'}
		>
			<TextField.Label class="absolute text-3 text-gray-8 top-0 left-2 bg-bg-0 px-2">{props.label}</TextField.Label>
			<TextField.Input class="border rounded block px-4 py-2 focus:border-black w-full" type={props.type} />
			<TextField.ErrorMessage class="text-3 text-red-6 text-left mt-1">{props.error}</TextField.ErrorMessage>
		</TextField>
	);
}