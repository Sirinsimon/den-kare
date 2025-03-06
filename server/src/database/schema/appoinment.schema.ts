import { text, pgTable, uuid, timestamp, date } from 'drizzle-orm/pg-core';
import { patientTable } from './patient.schema';
import { clinicTable } from './clinic.schema';

export const appointmentTable= pgTable('appointment', {
    id: uuid('id').primaryKey(),
    patientId: uuid('patient_id').notNull().references(() => patientTable.id),
    clinicId: uuid('clinicId').notNull().references(() => clinicTable.id),
    time: text('time').notNull(), 
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Appointment = typeof appointmentTable.$inferSelect;

