import * as pg from 'drizzle-orm/pg-core';
import type { PgColumnBuilderBase } from 'drizzle-orm/pg-core/columns/common';
import { id } from '~/db/utils';

export const place = pg.pgTable('place', {
	id,
	name:     pg.text().notNull(),
	location: pg.text().notNull(),
	cords:    pg.point().notNull(),
	createBy: pg.integer().notNull(),
});

const placeRelation = {
	id,
	placeId: pg.integer().notNull(),
} satisfies Record<string, PgColumnBuilderBase>;

export const placeTrait = pg.pgTable('place_trait', {
	...placeRelation,
	important: pg.boolean().notNull(),
	name:      pg.text().notNull(),
	value:     pg.text().notNull(),
});

export const placeSlot = pg.pgTable('place_slot', {
	...placeRelation,
	start: pg.timestamp().notNull(),
	end:   pg.timestamp().notNull(),
});