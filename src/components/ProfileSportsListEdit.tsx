import { createMemo, Index, Suspense } from 'solid-js';
import { createStore, unwrap } from 'solid-js/store';

export default function ProfileSportsListEdit(props: {
	initialSports: string[],
	onSubmit:      (newSports?: string[]) => void
}): JSXElement {
	const initialSportsJSON = JSON.stringify(props.initialSports);
	const [sports, setSports] = createStore([...props.initialSports]);

	const dirty = createMemo(() => JSON.stringify([...sports]) != initialSportsJSON);

	return (
		<form>
			<ul class="space-y-4 my-4 list-disc ml-6">
				<Suspense>
					<Index
						each={sports}
						children={(it, i) => (
							<li>
								<input
									type="text"
									value={it()}
									onInput={(ev) => setSports(i, ev.currentTarget.value)}
									class="border mr-2"
								/>
								<button
									type="button"
									class="i-ph-x size-5"
									onClick={() => {
										setSports((it) => it.toSpliced(i, 1));
									}}
									textContent="Usuń"
								/>
							</li>
						)}
					/>
				</Suspense>
			</ul>
			<div class="flex justify-between">
				<button
					onClick={() => {
						setSports((it) => [...it, '']);
					}}
					type="button"
					class="bg-gradient-to-b from-primary-5 to-primary-1 text-white rounded px-2 py-1"
					textContent="Dodaj"
				/>
				<button
					type="button"
					onClick={() => props.onSubmit(dirty() ? unwrap(sports).filter(Boolean) : undefined)}
					class="bg-gradient-to-b from-primary-5 to-primary-1 text-white rounded px-2 py-1"
				>
					{dirty() ? 'Zapisz' : 'Anuluj'}
				</button>
			</div>
		</form>
	);
}