import * as P from 'drizzle-orm/pg-core';
import { id } from '~/db/utils';

export const user = P.pgTable('user', {
	id,
	name:     P.text().notNull(),
	password: P.text().notNull(),
	email:    P.text().unique().notNull(),
	active:   P.boolean().default(false),
	sports:   P.text().array().default([]),
});

export const userActivation = P.pgTable('user_activation', {
	id:     P.text().primaryKey(),
	userId: P.integer().notNull(),
});