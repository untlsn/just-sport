import { cache, createAsync, redirect, useParams } from '@solidjs/router';
import db, { table } from '~/db';
import * as s from 'drizzle-orm';

const fetchPlaceExistence = cache(async (id: number) => {
	'use server';
	const [place] = await db.select({ id: table.place }).from(table.place).where(s.eq(table.place.id, id));
	if (!place) throw redirect(`/place/${id}/slot/create-fallback`);
}, 'fetchPlaceExistence');

export default function ThePage(): JSXElement {
	const params = useParams<{ id: string }>();
	createAsync(() => fetchPlaceExistence(+params.id));

	return (
		<form>
			Placówka istnieje
		</form>
	);
}