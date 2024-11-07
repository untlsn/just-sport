import { TextField } from '@kobalte/core/text-field';
import * as v from 'valibot';
import * as sf from '~/utils/form';
import { loginUserAction } from '~/server/auth';
import { useAction, useSubmission } from '@solidjs/router';
import { Show } from 'solid-js';
import clsx from 'clsx';
import { asHandledError } from '~/utils/errors';

const reqString = v.pipe(v.string('Pole wymagane'), v.minLength(1, 'Pole wymagane'));

const FormSchema = 	v.object({
	email:    v.pipe(reqString, v.email('Email nie jest prawidłowy')),
	password: v.pipe(reqString, v.minLength(6, 'Hasło musi mieć przynajmniej 6 znaków')),
});

export default function ThePage(): JSXElement {
	const loginUser = useAction(loginUserAction);
	const userLogin = useSubmission(loginUserAction);

	const form = sf.createForm({
		...sf.satisfiesSchema(FormSchema, {}),
		onSubmit(payload) {
			userLogin.clear();
			return loginUser(payload);
		},
	});

	const register = sf.createRegistry(form);

	return (
		<main class="grid place-items-center min-h-screen">
			<form
				onSubmit={form.submit}
				class="shadow-lg rounded-lg border p-4 text-center space-y-4 w-120 max-w-95vw"
			>
				<h1 class="text-8 mb-12">
					Logowanie
				</h1>
				<PageTextField {.../*@once*/register('email')} label="Email" />
				<PageTextField {.../*@once*/register('password')} label="Hasło" type="password" class="pb-12" />
				<p class="text-red-6 text-3">{asHandledError(userLogin.error)?.message}</p>
				<Show
					when={!userLogin.pending}
					fallback={(
						<span
							class="bg-gradient-to-b from-primary-5 to-primary-1 text-white rounded px-4 py-2 text-4"
						>
							<i class="i-line-md-loading-alt-loop" />
						</span>
					)}
				>
					<button
						type="submit"
						class="bg-gradient-to-b from-primary-5 to-primary-1 text-white rounded px-4 py-2 text-4"
					>
						Zaloguj się
					</button>
				</Show>

			</form>
		</main>
	);
}

function PageTextField(props: { label: string, type?: string, class?: string } & sf.LooseBaseField<string>): JSXElement {
	return (
		<TextField
			class={clsx('relative pt-2', props.class)}
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