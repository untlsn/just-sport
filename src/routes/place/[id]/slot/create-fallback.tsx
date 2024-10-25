export default function ThePage(): JSXElement {
	return (
		<div class="text-center min-h-screen flex-(~ col) justify-center items-center gap-6">
			<h1 class="text-10 max-w-200">Taka placówka nie istnieje, czy na pewno podałeś odpowiednii link?</h1>
			<p class="text-5 text-gray-4">
				"You went somewhere you weren't supposed to go<br />
				Saw something you weren't supposed to see"
			</p>
			<a href="" class="bg-gradient-to-b from-primary-5 to-primary-1 text-white rounded px-2 py-1 text-6">
				Wróć do strone główną
			</a>
		</div>
	);
}