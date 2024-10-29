import * as pg from 'drizzle-orm/pg-core';
import { id } from '~/db/utils';

export const user = pg.pgTable('event', {
	id,
	name:     pg.text().notNull(),
	password: pg.text().notNull(),
	email:    pg.text().unique().notNull(),
});