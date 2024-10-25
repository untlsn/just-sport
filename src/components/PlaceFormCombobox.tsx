import { createMemo, createSignal, For, Show } from 'solid-js';
import { produce } from 'solid-js/store';
import { Combobox } from '@kobalte/core/combobox';
import { Collapsible } from '@kobalte/core/collapsible';
import { TextField } from '@kobalte/core/text-field';
import style from './PlaceFormCombobox.module.css';
import clsx from 'clsx';

export type Trait = { name: string, value: string };
const traitsExample = ['Wysokośc', 'Szerokość', 'Długość'];

export default function PlaceFormCombobox(props: {
	title:    string,
	max:      number,
	value:    Trait[],
	onCreate: (name: string) => void
	onRemove: (index: number) => void,
	onRename: (index: number, value: string) => void,
}): JSXElement {
	const [value, setValue] = createSignal<string>('');
	const [open, setOpen] = createSignal(false);
	const full = createMemo(() => props.value.length >= props.max);
	const createElement = (name: string | null) => {
		if (!name || full()) return;
		props.onCreate(name);
		setValue('');
		setOpen(true);
	};

	return (
		<Combobox
			options={traitsExample}
			value={value()}
			onChange={createElement}
			itemComponent={(it) => (
				<Combobox.Item item={it.item}>
					{it.item.textValue}
				</Combobox.Item>
			)}
			disabled={full()}
		>
			<Combobox.Label class="my-2 text-5">
				{props.title}
			</Combobox.Label>
			<Combobox.Control class="w-fit flex gap-4 h-8 items-center">
				<Combobox.Input
					onChange={(ev: Event) => setValue((ev.currentTarget as HTMLInputElement).value)}
					onKeyDown={(ev) => {
						if (ev.key != 'Enter') return;
						ev.preventDefault();
						createElement(ev.currentTarget.value);
						ev.currentTarget.value = '';
					}}
					class="border-1 px-2 py-1"
				/>
				<button
					type="submit"
					onClick={() => createElement(value())}
					class="bg-gradient-to-b from-primary-5 to-primary-1 text-white rounded px-2 py-1"
				>
					Dodaj
				</button>
				<p>
					{props.value.length} / {props.max}
				</p>
			</Combobox.Control>
			<Combobox.Portal>
				<Combobox.Content class="px-4 py-2 bg-primary-0 rounded-lg shadow-lg">
					<Combobox.Listbox />
				</Combobox.Content>
			</Combobox.Portal>
			<Show when={props.value.length}>
				<Collapsible onOpenChange={setOpen} open={open()} class="my-2">
					<Collapsible.Content as="ul" class={clsx('grid-(~ cols-auto-3) w-fit gap-4', style.CollapsibleContent)}>
						<For
							each={props.value}
							children={(it, i) => (
								<TextField
									as="li"
									value={it.value}
									class="contents"
									onChange={(it) => props.onRename(i(), it)}
								>
									<TextField.Label>{it.name}:</TextField.Label>
									<TextField.Input class="border-b" />
									<button
										type="button"
										class="h-full aspect-square border rounded-lg p-1"
										onClick={() => {
											setArray(produce((draft) => {
												draft.splice(i(), 1);
											}));
										}}
									>
										<i class="i-ph-x" />
									</button>
								</TextField>
							)}
						/>
					</Collapsible.Content>
					<Collapsible.Trigger class="my-4">
						{open() ? 'Zamknij' : 'Pokaż'}
					</Collapsible.Trigger>
				</Collapsible>
			</Show>
		</Combobox>
	);
}