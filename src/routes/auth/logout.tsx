import { createAsync, Navigate } from '@solidjs/router';
import { logout } from '~/server/auth';

export default function Page(): JSXElement {
	createAsync(() => logout());

	return (
		<Navigate href="/auth/login" />
	);
}