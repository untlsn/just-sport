import * as sf from '~/utils/form';
import 'maplibre-gl/dist/maplibre-gl.css';
import { lazy, startTransition } from 'solid-js';
import type { Cords } from '~/components/PlaceFormMap';
import { TextField } from '@kobalte/core/text-field';
import type { Trait } from '~/components/PlaceFormCombobox';
import PlaceFormCombobox from '~/components/PlaceFormCombobox';
import { action, cache, createAsync, useAction } from '@solidjs/router';
import * as v from 'valibot';
import db, { table } from '~/db';
import { produce } from 'solid-js/store';

const ObjectFormMap = lazy(() => import('~/components/PlaceFormMap'));

const Trait = v.object({ name: v.string(), value: v.string() });
const Cords = v.object({ lon: v.number(), lat: v.number() });

const FormSchema = v.object({
	name:              v.string(),
	cords:             v.pipe(Cords, v.transform(({ lat, lon }): [number, number] => [lat, lon])),
	traits:            v.array(Trait),
	unimportantTraits: v.array(Trait),
});

const fetchReverseGeocode = cache(async (cords: Cords) => {
	'use server';
	const searchParams = new URLSearchParams();
	searchParams.set('api_key', process.env.GEOCODE_API_KEY!);
	searchParams.set('lat', String(cords.lat));
	searchParams.set('lon', String(cords.lon));

	const res = await fetch(`https://geocode.maps.co/reverse?${searchParams.toString()}`);
	const json = await res.json();
	return await json.display_name;
}, 'fetchReverseGeocode');

const placeSubmitAction = action(async (input: v.InferOutput<typeof FormSchema>, location: string) => {
	'use server';

	const [{ placeId }] = await db.insert(table.place).values([{
		name:     input.name,
		location,
		cords:    input.cords,
		createBy: 1,
	}]).returning({ placeId: table.place.id });

	await db.insert(table.placeTrait).values([
		...input.traits.map((it) => ({
			placeId,
			important: true,
			...it,
		})),
		...input.unimportantTraits.map((it) => ({
			placeId,
			important: false,
			...it,
		})),
	]);
});

type FormInput = {
	name:              string,
	traits:            Trait[],
	unimportantTraits: Trait[],
	cords?:            Cords,
};

function removeIndex<T>(i: number) {
	return produce((draft: T[]) => {
		draft.splice(i, 1);
	});
}

export default function ThePage(): JSXElement {
	const form = sf.createForm<FormInput, v.InferOutput<typeof FormSchema>>({
		initialValues: {
			name:              '',
			traits:            [],
			unimportantTraits: [],
		},
		transform: v.parser(FormSchema),
		onSubmit(value) {
			void placeSubmit(value, location()!);
		},
	});

	const placeSubmit = useAction(placeSubmitAction);
	const location = createAsync(async () => {
		const { cords } = form.values;
		if (!cords) return '';
		return fetchReverseGeocode(cords);
	});

	const nameField = sf.createBaseField({ form, name: 'name' });

	return (
		<form onSubmit={form.submit} class="mx-auto w-320">
			<header class="text-8 font-semibold">
				Tworzenie placówki
			</header>
			<TextField onChange={nameField.onChange} class="my-2 relative">
				<TextField.Label class="block absolute left-2 top-0 bg-white px-2">Nazwa placówki: </TextField.Label>
				<TextField.Input
					value={nameField.value}
					class="border-1 px-2 py-1 my-3"
				/>
			</TextField>
			<p class="my-2">
				{location() || '-'}
			</p>
			<ObjectFormMap
				onChange={(cords) => startTransition(() => form.setValues('cords', cords))}
				value={form.values.cords}
			/>
			<div class="grid-(~ cols-2) my-4">
				<PlaceFormCombobox
					value={form.values.traits}
					onCreate={(name) => form.setValues('traits', (it) => [...it, { name, value: '' }])}
					onRename={(i, value) => form.setValues('traits', i, 'value', value)}
					onRemove={(i) => form.setValues('traits', removeIndex(i))}
					max={10}
					title="Główne cechy"
				/>
				<PlaceFormCombobox
					value={form.values.unimportantTraits}
					onCreate={(name) => form.setValues('unimportantTraits', (it) => [...it, { name, value: '' }])}
					onRename={(i, value) => form.setValues('unimportantTraits', i, 'value', value)}
					onRemove={(i) => form.setValues('unimportantTraits', removeIndex(i))}
					max={50}
					title="Cechy dodatkowe"
				/>
			</div>
			<button
				type="submit"
				class="bg-gradient-to-b from-[#F05D15] to-[#F7BC6C] text-white rounded px-4 py-2 text-5"
			>
				Stwórz placówke
			</button>
		</form>
	);
}
