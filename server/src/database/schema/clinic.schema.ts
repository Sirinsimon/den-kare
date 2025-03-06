import { text, pgTable, uuid } from 'drizzle-orm/pg-core';

export const clinicTable = pgTable('clinic', {
    id: uuid('id').primaryKey(),
    name: text('name').notNull(),
    location: text('location').notNull(),
});

export type Clinic = typeof clinicTable.$inferSelect;
