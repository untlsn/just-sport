import db, { table } from '~/db';
import { nanoid } from 'nanoid';
import { action } from '@solidjs/router';
import { sendMail } from '~/server/mailer';


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
				userId, token,
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