import { z } from 'zod';

export const createDoctorSchema = z.object({
    id: z.string().uuid('Doctor ID must be a valid UUID'),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    pwd: z.string().min(6, 'Password must be at least 6 characters'),
    clinicId: z.string().uuid('Clinic ID must be a valid UUID')
});

export const getDoctorByIdSchema = z.object({
    id: z.string().uuid('Doctor ID must be a valid UUID'),
});

export const getDoctorByEmailSchema = z.object({
    email: z.string().email('Invalid email format'),
});

