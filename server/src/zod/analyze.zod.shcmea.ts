import { z } from 'zod';

export const saveDetectSchema = z.object({
    appointment_id: z.string().uuid('Appointment ID must be a valid UUID'),
    clinicId: z.string().uuid('Clinic ID must be a valid UUID'),
    detected: z.array(z.string()).default([]), // Ensure detected is always an array
    past_history: z.string().optional().default('') // Fix: Make past_history a string
});

export const getDetectionsSchema = z.object({
    appointment_id: z.string().uuid('Appointment ID must be a valid UUID'),
});

export const updatePastHistorySchema = z.object({
    appointment_id: z.string().uuid('Appointment ID must be a valid UUID'),
    past_history: z.string().min(1, 'Past history cannot be empty') // Ensure past_history is a non-empty string
});

