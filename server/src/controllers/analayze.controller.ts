import { Request, Response, NextFunction } from 'express';
import { getDetectionsSchema, saveDetectSchema, updatePastHistorySchema } from '../zod/analyze.zod.shcmea';
import { db } from "../database/db"
import { detections } from '../database/schema/detected.schema';
import { CustomError } from '../classes/CustomError.class';
import { eq } from 'drizzle-orm';


async function saveDetectedDataController(req: Request, res: Response, next: NextFunction) {
    const result = saveDetectSchema.safeParse(req.body);
    if (!result.success) {
        return next(result.error);
    }

    try {
        const { appointment_id, clinicId, detected, past_history } = result.data;

        const data = await db.insert(detections).values({
            appointmentId: appointment_id,
            clinicId,
            detected,
            past_history: past_history ?? '' // Ensure default empty string if undefined
        }).returning();

        res.status(201).json({ message: 'Detected data saved successfully', data });
    } catch (error) {
        console.error(error);
        next(new CustomError(500, 'Failed to save detected data'));
    }
}

async function getDetectionsFromAppointmentId(req: Request, res: Response, next: NextFunction) {
    const result = getDetectionsSchema.safeParse(req.query);
    if (!result.success) {
        return next(result.error);
    }
    try {
        const { appointment_id } = result.data;

        console.log(appointment_id)
        const detectionRecords = await db
            .select()
            .from(detections)
            .where(eq(detections.appointmentId, appointment_id));

        if (detectionRecords.length === 0) {
            throw new CustomError(404, 'No detections found for this appointment ID');
        }

        res.status(200).json(detectionRecords[0]);
    } catch (error) {
        console.log(error);
        next(new CustomError(500, 'Failed to retrieve detected data'));
    }
}

export async function updatePastHistoryController(req: Request, res: Response, next: NextFunction) {
    const result = updatePastHistorySchema.safeParse(req.body);
    if (!result.success) {
        return next(result.error);
    }
    try {
        const { appointment_id, past_history } = result.data;
        const existingRecord = await db
            .select()
            .from(detections)
            .where(eq(detections.appointmentId, appointment_id));

        if (existingRecord.length === 0) {
            throw new CustomError(404, 'Detection record not found');
        }

        await db
            .update(detections)
            .set({ past_history })
            .where(eq(detections.appointmentId, appointment_id));

        res.status(200).json({ message: 'Past history updated successfully' });
    } catch (error) {
        console.log(error);
        next(new CustomError(500, 'Failed to update past history'));
    }
}


export { saveDetectedDataController, getDetectionsFromAppointmentId };

