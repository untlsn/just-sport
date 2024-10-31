import { createSignal, For, Show, Suspense } from 'solid-js';
import ProfileSportsListEdit from '~/components/ProfileSportsListEdit';

export default function ProfileSportsList(props: {
	sports:   string[] | undefined,
	onSubmit: (newSports: string[]) => void
}): JSXElement {
	const [editMode, setEditMode] = createSignal(false);

	return (
		<Suspense>
			<div>
				<p class="text-5">Sporty</p>
				<Show
					when={!editMode()}
					fallback={(
						<ProfileSportsListEdit
							initialSports={props.sports || []}
							onSubmit={(newSports) => {
								setEditMode(false);
								if (newSports) props.onSubmit(newSports);
							}}
						/>
					)}
				>
					<ul class="my-4 space-y-2 list-disc ml-6">
						<For
							each={props.sports}
							fallback={(
								<li class="text-gray-5">Brak</li>
							)}
							children={(it) => (
								<li>
									{it}
								</li>
							)}
						/>
					</ul>
					<div class="text-right">
						<button
							type="button"
							onClick={() => setEditMode(true)}
							class="bg-gradient-to-b from-primary-5 to-primary-1 text-white rounded px-2 py-1"
							textContent="Zmień liste"
						/>
					</div>
				</Show>
			</div>
		</Suspense>
	);
}