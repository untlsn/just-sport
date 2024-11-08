import * as sf from '~/utils/form';
import { cache, createAsync } from '@solidjs/router';
import { TextField } from '@kobalte/core/text-field';
import type { ParentProps } from 'solid-js';
import { For, lazy, startTransition } from 'solid-js';
import type { Cords } from '~/components/EventFormMap';
import * as v from 'valibot';
import { formString } from '~/utils/valibot';
import { Checkbox } from '@kobalte/core/checkbox';
import EventFormClockPicker from '~/components/EventFormClockPicker';

const EventFormMap = lazy(() => import('~/components/EventFormMap'));

const fetchReverseGeocode = cache(async (cords: Cords) => {
	'use server';
	const searchParams = new URLSearchParams();
	searchParams.set('api_key', process.env.GEOCODE_API_KEY!);
	searchParams.set('lat', String(cords.lat));
	searchParams.set('lon', String(cords.lng));

	const res = await fetch(`https://geocode.maps.co/reverse?${searchParams.toString()}`);
	const json = await res.json();
	return await json.display_name;
}, 'fetchReverseGeocode');

const FormSchema = v.object({
	cords: v.object({
		lat: v.number(),
		lng: v.number(),
	}),
	name:     formString(),
	category: formString(),
	start:    v.date(),
	end:      v.date(),
});

export default function ThePage(): JSXElement {
	const form = sf.createForm({
		...sf.satisfiesSchema(FormSchema, {
			name: '',
		}),
		onSubmit() {},
	});

	const location = createAsync(async () => {
		const { cords } = form.values;
		if (!cords) return '';
		return fetchReverseGeocode(cords);
	});

	const register = sf.createRegistry(form);

	return (
		<form onSubmit={form.submit}>
			<header class="text-8 font-semibold">
				Tworzenie wydarzenia
			</header>
			<EventFormInput {.../*@once*/register('name')} label="Nazwa" />
			<p class="my-2">
				{location() || '-'}
			</p>
			<EventFormMap
				onChange={(cords) => startTransition(() => form.setValues('cords', cords))}
				value={form.values.cords}
			/>
			<div class="grid-(~ cols-fit-100) my-4">
				<div>
					<div class="space-x-4">
						<label>Data</label>
						<input type="date" />
					</div>
					<p>Godzina:</p>
					<EventFormClockPicker
						label="Rozpoczęcia"
						value={form.values.start}
						onChange={(it) => form.setValues('start', it)}
					/>
					<EventFormClockPicker
						label="Zakończenia"
						value={form.values.end}
						onChange={(it) => form.setValues('end', it)}
					/>
				</div>
				<EventFormInput {.../*@once*/register('name')} label="Kategoria">
					<TextField.Description class="text-3 text-gray-6 relative -top-2 left-2">
						np. piłka nożna, tenis, bieganie
					</TextField.Description>
				</EventFormInput>
				<div>
					<p class="mb-2">Grupy wiekowe: </p>
					<For
						each={['Dzieci', 'Młodzież', 'Dorośli', 'Seniorzy']}
						children={(it, i) => (
							<Checkbox value={String(i())} class="flex items-center gap-2 ml-2">
								<Checkbox.Input />
								<Checkbox.Control>
									<Checkbox.Indicator forceMount class="text-6 i-ph-square data-[checked]:i-ph-check-square-fill" />
								</Checkbox.Control>
								<Checkbox.Label>{it}</Checkbox.Label>
							</Checkbox>
						)}
					/>
				</div>
			</div>
			<button
				type="submit"
				class="bg-gradient-to-b from-primary-5 to-primary-1 text-white rounded px-4 py-2 text-5"
			>
				Stwórz wydarzenie
			</button>
		</form>
	);
}

function EventFormInput(props: sf.LooseBaseField<string> & ParentProps & { label: string }): JSXElement {
	return (
		<TextField onChange={props.onChange} class="my-2 relative">
			<TextField.Label class="block absolute left-2 top-0 bg-bg-0 px-2">{props.label}:</TextField.Label>
			<TextField.Input
				value={props.value}
				class="border-1 px-2 py-1 my-3"
			/>
			{props.children}
		</TextField>
	);
}
