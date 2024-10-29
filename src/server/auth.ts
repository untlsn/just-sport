import db, { table } from '~/db';
import { nanoid } from 'nanoid';
import { action } from '@solidjs/router';
import { sendMail } from '~/server/mailer';
import * as S from 'drizzle-orm';

export async function activateEmail(token: string): Promise<boolean> {
	'use server';
	const where = S.eq(table.userActivation.id, token);
	const [user] = await db.select({ id: table.userActivation.userId }).from(table.userActivation).where(where);

	if (!user) return false;

	await db.delete(table.userActivation).where(where);
	await db.update(table.user).set({ active: true	})
		.where(S.eq(table.user.id, user.id));
	return true;
}

export const registerUserAction = action(async (payload: {
	name:     string,
	password: string,
	email:    string,
}): Promise<boolean> => {
	'use server';
	try {
		const [{ userId }] = await db.insert(table.user)
			.values([payload])
			.returning({ userId: table.user.id });
		const token = nanoid();

		await Promise.all([
			db.insert(table.userActivation).values([{
				userId, id: token,
			}]),
			sendMail({
				from:    process.env.EMAIL_USER,
				to:      payload.email,
				subject: 'Aktywacja konta w just-sport',
				html:    `<p>W celu aktywowania konta uzyj linku poniżej</p><p><a href="${process.env.URL_PREFIX}/auth/confirm?token=${token}">Aktywuj konto</a></p>`,
			}),
		] as const);


		return true;
	} catch (e) {
		return false;
	}
});