import { text, pgTable, uuid } from 'drizzle-orm/pg-core';
import { clinicTable } from './clinic.schema';

export const doctorTable = pgTable('doctors', {
    id: uuid('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    pwd: text('pwd').notNull(),
    clinicId: uuid('clinicId').notNull().references(() => clinicTable.id),

});

export type Doctor = typeof doctorTable.$inferSelect;
