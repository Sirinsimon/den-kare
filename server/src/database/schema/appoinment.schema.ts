import { text, pgTable, uuid, timestamp, date } from 'drizzle-orm/pg-core';
import { patientSchema } from './patient.schema';
import { clinicTable } from './clinic.schema';

export const appointmentSchema = pgTable('appointment', {
    id: uuid('id').primaryKey(),
    patientId: uuid('patient_id').notNull().references(() => patientSchema.id),
    clinicId: uuid('clinicId').notNull().references(() => clinicTable.id),
    time: text('time').notNull(), 
    date: date('date').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Appointment = typeof appointmentSchema.$inferSelect;

