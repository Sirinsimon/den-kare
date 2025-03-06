import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { clinicTable } from './schema/clinic.schema';
import { doctorTable } from './schema/doctor.schema';
import { patientTable } from './schema/patient.schema';
import { appointmentTable } from './schema/appoinment.schema';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
    connectionString: process.env.DB_LOCAL_URL, 
});

const db = drizzle(pool);

async function seed() {
    console.log('Seeding database...');

    // Insert clinics
    const clinics = await db.insert(clinicTable).values([
        { id: uuidv4(), name: 'Sunrise Clinic', location: 'New York' },
        { id: uuidv4(), name: 'Harmony Health', location: 'Los Angeles' },
    ]).returning();

    console.log('Clinics seeded:', clinics);

    // Insert doctors
    const doctors = await db.insert(doctorTable).values([
        { id: uuidv4(), name: 'Dr. John Doe', email: 'john@example.com', pwd: 'hashedpassword', clinicId: clinics[0].id },
        { id: uuidv4(), name: 'Dr. Jane Smith', email: 'jane@example.com', pwd: 'hashedpassword', clinicId: clinics[1].id },
    ]).returning();

    console.log('Doctors seeded:', doctors);

    const patients = await db.insert(patientTable).values([
        {
            id: uuidv4(),
            name: 'Alice Brown',
            age: '30', // Age as a string (as per schema)
            gender: 'male', 
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: uuidv4(),
            name: 'Bob White',
            age: '40', // Age as a string (as per schema)
            gender: 'female', 
            createdAt: new Date(),
            updatedAt: new Date()
        },
    ]).returning();


    console.log('Patients seeded:', patients);

    const appointments = await db.insert(appointmentTable).values([
        {
            id: uuidv4(),
            patientId: patients[0].id,
            clinicId: clinics[0].id,
            time: '10:30 AM',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: uuidv4(),
            patientId: patients[1].id,
            clinicId: clinics[1].id,
            time: '02:00 PM',
            createdAt: new Date(),
            updatedAt: new Date()
        },
    ]);

    console.log('Appointments seeded:', appointments);
    console.log('Seeding complete!');
}

seed().catch((err) => {
    console.error('Seeding failed:', err);
}).finally(() => {
    pool.end();
});
