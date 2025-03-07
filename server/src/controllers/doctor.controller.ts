import { Request, Response, NextFunction } from 'express';
import { v4 } from 'uuid';
import { createNewDoctor, getDoctorById, getDoctorByEmail } from '../services/doctor.service';
import { createDoctorSchema, getDoctorByIdSchema, getDoctorByEmailSchema } from '../zod/doctor.zod.schema';
import { CustomError } from '$/classes/CustomError.class';
import { db } from '$/database/db';
import { appointmentTable } from '$/database/schema/appoinment.schema';
import { patientTable } from '$/database/schema/patient.schema';
import { eq } from 'drizzle-orm';

async function createDoctorController(req: Request, res: Response, next: NextFunction) {
    try {
        const doctorData = { ...req.body, id: v4() };

        const result = createDoctorSchema.safeParse(doctorData);
        if (!result.success) {
            return next(result.error);
        }

        const newDoctor = await createNewDoctor(result.data);
        if (!newDoctor) {
            throw new CustomError(500, 'Failed to create doctor');
        }

        res.status(201).json(newDoctor);
    } catch (error) {
        next(error);
    }
}

async function getDoctorByIdController(req: Request, res: Response, next: NextFunction) {
    const result = getDoctorByIdSchema.safeParse(req.params);
    if (!result.success) {
        return next(result.error);
    }

    const doctor = await getDoctorById(result.data.id);
    if (!doctor) {
        throw new CustomError(404, 'Doctor not found');
    }

    res.status(200).json(doctor);
}

async function getDoctorByEmailController(req: Request, res: Response, next: NextFunction) {
    const result = getDoctorByEmailSchema.safeParse(req.query);
    if (!result.success) {
        return next(result.error);
    }

    const doctor = await getDoctorByEmail(result.data.email);
    if (!doctor) {
        throw new CustomError(404, 'Doctor not found');
    }

    res.status(200).json(doctor);
}


export async function fetchAllAppointmentsController(req: Request, res: Response, next: NextFunction) {
    try {
        const appointments = await db
            .select({
                id: appointmentTable.id,
                time: appointmentTable.time,
                createdAt: appointmentTable.createdAt,
                updatedAt: appointmentTable.updatedAt,
                patient: patientTable.name,
                clinicId: appointmentTable.clinicId
            })
            .from(appointmentTable)
            .leftJoin(patientTable, eq(appointmentTable.patientId, patientTable.id))
            .limit(5)
            .execute();

        res.status(200).json(appointments);
    } catch (error) {
        next(error);
    }
}



export { createDoctorController, getDoctorByIdController, getDoctorByEmailController };

