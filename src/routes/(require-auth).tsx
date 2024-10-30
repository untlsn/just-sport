import type { FlowProps } from 'solid-js';
import { Show } from 'solid-js';
import { createAsync } from '@solidjs/router';
import { fetchUserAuth } from '~/server/auth';
import BaseFallback from '~/components/BaseFallback';

export default function ThePage(props: FlowProps): JSXElement {
	const userAuth = createAsync(() => fetchUserAuth());

	return (
		<Show
			when={userAuth()}
			fallback={(
				<BaseFallback title="Zeby wejść na tą podstrone musisz być zalogowany" />
			)}
		>
			{props.children}
		</Show>
	);
}