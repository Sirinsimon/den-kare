import { text, pgTable, uuid } from 'drizzle-orm/pg-core';
import { patientTable } from './patient.schema';

export const diagnosisTable = pgTable('diagnosis', {
    id: uuid('id').primaryKey(),
    appointmentId: uuid('patient_id').notNull().references(() => patientTable.id),
    information: text('information').notNull(),
});

export type DiagnosisTable = typeof diagnosisTable.$inferSelect;


