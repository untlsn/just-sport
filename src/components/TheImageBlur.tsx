import { createSelector, createSignal, Index, onCleanup, onMount } from 'solid-js';
import clsx from 'clsx';

export default function TheImageBlur(): JSXElement {
	const isImage = createSignalSequenceSelector();

	return (
		<>
			<Index
				each={Array(3)}
				children={(_, i) => {
					return (
						<img
							src={`/images/landing-${i}.webp`}
							alt=""
							class={clsx(
								'w-screen h-220 object-cover absolute left-0 transition-all duration-1000',
								isImage(i) ? 'opacity-100' : 'opacity-0',
							)}
						/>
					);
				}}
			/>
		</>
	);
}

function createSignalSequenceSelector() {
	const [number, setNumber] = createSignal(0);

	onMount(() => {
		const interval = setInterval(() => {
			setNumber((it) => it < 2 ? it + 1 : 0);
		}, 5000);
		onCleanup(() => {
			clearInterval(interval);
		});
	});

	// eslint-disable-next-line solid/reactivity
	return createSelector(number);
}