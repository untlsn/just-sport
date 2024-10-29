import BaseFallback from '~/components/BaseFallback';
import { createAsync, Navigate, useSearchParams } from '@solidjs/router';
import { activateEmail } from '~/server/auth';
import { Show } from 'solid-js';

export default function ThePage(): JSXElement {
	const [query] = useSearchParams();
	const activated = createAsync(async () => {
		if (!query.token || typeof query.token != 'string') return false;
		return activateEmail(query.token);
	});

	return (
		<Show
			when={activated()}
			children={<Navigate href="/auth/login" />}
			fallback={<BaseFallback title="Dany token nie istnieje, albo został już użyty" />}
		/>
	);
}