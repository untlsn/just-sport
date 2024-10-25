import TheImageBlur from '~/components/TheImageBlur';

export default function Page(): JSXElement {


	return (
		<main>
			<div class="relative">
				<TheImageBlur />
				<h1 class="text-white inset-y-0 left-1/5 my-auto z-1 absolute size-fit text-32 text-shadow-lg">
					Just <i class="i-ph-arrow-fat-lines-right-fill translate-y-6" /> <br />
					<span class="ml-26">Sport</span>
				</h1>
			</div>
		</main>
	);
}
