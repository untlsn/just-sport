import TheImageBlur from '~/components/TheImageBlur';

export default function Page(): JSXElement {


	return (
		<main>
			<div class="h-220 grid items-center">
				<TheImageBlur />
				<h1 class="text-white z-1 size-fit text-32 text-shadow-lg">
					Just <i class="i-ph-arrow-fat-lines-right-fill translate-y-6" /> <br />
					<span class="ml-26">Sport</span>
				</h1>
			</div>
		</main>
	);
}
