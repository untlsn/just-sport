import db, { table } from '~/db';
import { nanoid } from 'nanoid';
import { action, cache, redirect } from '@solidjs/router';
import { sendMail } from '~/server/mailer';
import * as S from 'drizzle-orm';
import { useSession } from 'vinxi/http';
import { createError, pipeHandledError } from '~/utils/errors';
import * as bcrypt from 'bcrypt';

type SessionData = { userId: number };

type Session = ReturnType<typeof useSession<SessionData>>;

async function getSession(): Promise<Session> {
	'use server';
	if (!process.env.SESSION_SECRET) throw new Error('SESSION_SECRET is not defined in envs');
	return useSession<SessionData>({
		password: process.env.SESSION_SECRET,
	});
}

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


export const loginUserAction = action(async (payload: {
	email:    string,
	password: string,
}) => {
	'use server';

	try {
		const [user] = await db.select().from(table.user)
			.where(S.eq(table.user.email, payload.email));

		if (!user) throw createError('Email jest nieprawidłowy');
		if (!user.active) throw createError('Użytkownik nie został aktywowany');
		if (await bcrypt.compare(user.password, payload.password)) throw createError('Hasło nie jest prawiodłowe');
		const session = await getSession();
		await session.update({ userId: user.id });
		return redirect('/');

	} catch (e) {
		pipeHandledError(e);
	}
});

export const registerUserAction = action(async (payload: {
	name:     string,
	password: string,
	email:    string,
}): Promise<boolean> => {
	'use server';
	try {
		const [{ userId }] = await db.insert(table.user)
			.values([{
				name:     payload.name,
				email:    payload.email,
				password: await bcrypt.hash(payload.password, 12),
			}])
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

export const fetchUserName = cache(async () => {
	'use server';

	const session = await getSession();
	const { userId } = session.data;
	if (!userId) return '';
	const [user] = await db.select({ name: table.user.name }).from(table.user).where(S.eq(table.user.id, userId));
	if (!user) return '';

	return user.name;
}, 'fetchUserName');

export const fetchUserAuth = cache(async () => {
	'use server';

	const session = await getSession();
	return !!(session.data.userId);
}, 'fetchUserAuth');


export async function logout(): Promise<void> {
	'use server';

	const session = await getSession();
	await session.clear();
}

export const fetchUserProfile = cache(async () => {
	'use server';

	const session = await getSession();
	const { userId } = session.data;
	if (!userId) throw createError('Nie jesteś zalogowany');

	const [user] = await db.select().from(table.user).where(S.eq(table.user.id, userId));

	if (user) return user;
	throw createError('Nie jesteś zalogowany');
}, 'fetchUserProfile');


export const updateSportsAction = action(async (sports: string[]) => {
	'use server';

	const session = await getSession();
	const { userId } = session.data;
	if (!userId) throw createError('Nie jesteś zalogowany');

	const [res] = await db.update(table.user).set({
		sports,
	}).where(S.eq(table.user.id, userId)).returning({ sports: table.user.sports });
	return res.sports;
});