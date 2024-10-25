import { createSignal, onCleanup, onMount } from 'solid-js';
import style from './TheImageBlur.module.css';
import clsx from 'clsx';

export default function TheImageBlur(): JSXElement {
	const image = createSignalSequence(2);

	return (
		<img src={`/images/landing-${image() + 1}.webp`} alt="" class={clsx('w-full h-200 object-cover', style.Image)} />
	);
}

function createSignalSequence(to: number) {
	const [number, setNumber] = createSignal(0);

	onMount(() => {
		const interval = setInterval(() => {
			setNumber((it) => it < to ? it + 1 : 0);
		}, 10000);
		onCleanup(() => {
			clearInterval(interval);
		});
	});

	return number;
}