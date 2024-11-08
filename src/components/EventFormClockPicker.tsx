import { Popover } from '@kobalte/core/popover';
import { createSelector, createSignal, createUniqueId, Index, onCleanup, onMount, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import clsx from 'clsx';
import { RadioGroup } from '@kobalte/core/radio-group';
import * as date from 'date-fns';

export default function EventFormClockPicker(props: {
	label:    string
	onChange: (date: Date) => void,
	value?:   Date,
}): JSXElement {
	const id = createUniqueId();
	const [clock, setClock] = createStore({ hour: 0, minutes: 0, isHour: true, pm: false });
	const fullHour = () => clock.hour + (clock.pm ? 12 : 0);

	return (
		<div class="relative w-fit">
			<label for={id} class="block absolute left-1 top-0 bg-bg-0 px-2">{props.label}</label>
			<p class="leading-0 text-transparent px-4">{props.label}</p>
			<Popover>
				<Popover.Trigger id={id} class="border-1 px-2 py-1 my-3 w-full text-left">
					{props.value ? date.format(props.value, 'HH:mm') : '--:--'}
				</Popover.Trigger>
				<Popover.Portal>
					<Popover.Content class="bg-white rounded shadow-lg border p-4 select-none">
						<Popover.Arrow size={32} />
						<RadioGroup class="flex gap-4 items-center justify-between" defaultValue="false" onChange={(it) => setClock('pm', it == 'true')}>
							<EventFormClockPickerAmPmButton />
							<p class="text-8 text-center my-4">
								<button
									type="button"
									class={clsx('px-1 rounded-lg', clock.isHour && 'bg-primary-4 text-white')}
									onClick={() => setClock('isHour', true)}
								>
									{String(fullHour()).padStart(2, '0')}
								</button>
								:
								<button
									type="button"
									class={clsx('px-1 rounded-lg', !clock.isHour && 'bg-primary-4 text-white')}
									onClick={() => setClock('isHour', false)}
								>
									{String(clock.minutes).padStart(2, '0')}
								</button>
							</p>
							<EventFormClockPickerAmPmButton pm />
						</RadioGroup>
						<Show
							when={clock.isHour}
							fallback={(
								<EventFormClockPickerClock
									onChange={(it) => setClock('minutes', it)}
									value={clock.minutes}
									size={60}
									gap={5}
								/>
							)}
						>
							<EventFormClockPickerClock
								onMouseUp={() => setClock('isHour', false)}
								onChange={(it) => setClock('hour', it)}
								value={clock.hour}
								start={clock.pm ? 12 : 0}
								size={12}
							/>
						</Show>
						<div class="text-right">
							<Popover.CloseButton
								class="bg-gradient-to-b from-primary-5 to-primary-1 text-white rounded px-2 py-1"
								onClick={() => {
									const date = new Date();
									date.setHours(fullHour());
									date.setMinutes(clock.minutes);
									props.onChange(date);
								}}
							>
								OK
							</Popover.CloseButton>
						</div>
					</Popover.Content>
				</Popover.Portal>
			</Popover>
		</div>
	);
}

function EventFormClockPickerAmPmButton(props: { pm?: boolean }): JSXElement {
	return (
		<RadioGroup.Item
			value={String(!!props.pm)}
			class="data-[checked]:opacity-100 opacity-50 w-10 text-center"
		>
			<RadioGroup.ItemLabel>{props.pm ? 'PM' : 'AM'}</RadioGroup.ItemLabel>
			<RadioGroup.ItemInput />
		</RadioGroup.Item>
	);
}

function EventFormClockPickerClock(props: {
	value:      number,
	onChange:   (value: number) => void,
	onMouseUp?: () => void
	size:       number,
	gap?:       number,
	start?:     number
}): JSXElement {
	const mouseDown = useOnMouseDown();
	const isValue = createSelector(() => props.value);
	const getRotateStyle = (value: number) => ({
		'--rotate': `${value * 360 / props.size}deg`,
	});

	return (
		<div
			class="border-1 rounded-full size-64 relative"
			onMouseUp={() => {
				if (mouseDown()) props.onMouseUp?.();
			}}
		>
			<Index
				each={Array(props.size)}
				children={(_, i) => {
					const select = () => props.onChange(i);
					return (
						<div
							style={getRotateStyle(i)}
							data-selected={isValue(i) ? 'true' : undefined}
							class={clsx(
								'h-1/2 absolute inset-x-0 top-0 mx-auto pt-2 w-fit rotate-[--rotate] origin-b z-1 font-bold data-[selected]:text-white',
							)}
							onMouseOver={() => {
								if (mouseDown()) select();
							}}
							onMouseDown={select}
						>
							<div class={clsx('rotate-[calc(-1*var(--rotate))]', props.gap && i % props.gap && 'text-transparent')}>
								{(i || props.size) + (props.start || 0)}
							</div>
						</div>
					);
				}}
			/>
			<div
				style={getRotateStyle(props.value)}
				class="h-1/2 w-2 bg-primary-3 mx-auto rounded-full origin-b rotate-[--rotate] before:(c_ absolute top size-8 bg-primary-3 rounded-full -translate-x-3)"
			/>
		</div>
	);
}

function useOnMouseDown() {
	const [mouseDown, setMouseDown] = createSignal(false);

	onMount(() => {
		const abort = new AbortController();
		document.addEventListener('mousedown', () => setMouseDown(true), { signal: abort.signal });
		document.addEventListener('mouseup', () => setMouseDown(false), { signal: abort.signal });

		onCleanup(() => abort.abort());
	});

	return mouseDown;
}