import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const detections = pgTable('detections', {
    appointmentId: uuid('appointment_id').primaryKey().notNull(),
    clinicId: uuid('clinic_id').notNull(),
    detected: text('detected').array().default([]),
    past_history: text('past_history').default(''), // Fix: Make past_history a text field
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

