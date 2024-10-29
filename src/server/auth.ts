import db, { table } from '~/db';

export async function registerUser(payload: {
	name:     string,
	password: string,
	email:    string,
}): Promise<boolean> {
	'use server';
	try {
		await db.insert(table.user)
			.values([payload]);
		return true;
	} catch (e) {
		return false;
	}
}