import * as P from 'drizzle-orm/pg-core';
import { id } from '~/db/utils';

export const user = P.pgTable('user', {
	id,
	name:     P.text().notNull(),
	password: P.text().notNull(),
	email:    P.text().unique().notNull(),
	active:   P.boolean(),
});

export const userActivation = P.pgTable('user_activation', {
	id,
	userId: P.integer(),
	token:  P.text(),
});