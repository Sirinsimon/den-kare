import { db } from '$/database/db';
import { Doctor } from '$/database/schema/doctor.schema';
import { and, eq } from 'drizzle-orm';
import { doctorTable } from '$/database/schema/doctor.schema';

async function getDoctorByEmail(email: string) {
  const data = await db.select().from(doctorTable).where(eq(doctorTable.email, email)).limit(1);
  return data.at(0) || null;
}

async function createNewDoctor(doctor: Doctor) {
  const insert = await db.insert(doctorTable).values(doctor).returning(); 
  return insert.at(0) || null;
}

async function getDoctorById(id: string) {
  const doctor = await db.select().from(doctorTable).where(eq(doctorTable.id, id)).limit(1);
  return doctor.at(0) || null;
}

async function getDoctorsByClinic(clinicId: string) {
  const doctors = await db.select().from(doctorTable).where(eq(doctorTable.clinicId, clinicId));
  return doctors;
}

async function updateDoctorById(id: string, updates: Partial<Doctor>) {
  const update = await db.update(doctorTable).set(updates).where(eq(doctorTable.id, id)).returning();
  return update.at(0) || null;
}

async function deleteDoctorById(id: string) {
  const deleted = await db.delete(doctorTable).where(eq(doctorTable.id, id)).returning();
  return deleted.at(0) || null;
}

export { getDoctorByEmail, createNewDoctor, getDoctorById, getDoctorsByClinic, updateDoctorById, deleteDoctorById };

