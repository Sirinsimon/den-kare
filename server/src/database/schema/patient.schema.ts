import { text, pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';

export const patientTable = pgTable('patient', {
    id: uuid('id').primaryKey(),
    name: text('name').notNull(),
    age: text('age').notNull(),
    gender: text('gender').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Patient = typeof patientTable.$inferSelect;

