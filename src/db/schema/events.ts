import * as pg from 'drizzle-orm/pg-core';
import { id } from '~/db/utils';

export const event = pg.pgTable('event', {
	id,
});