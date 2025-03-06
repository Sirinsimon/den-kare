import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { Doctor } from '$/database/schema/doctor.schema';
import { createNewDoctor, getDoctorByEmail, getDoctorById } from '$/services/doctor.service';


passport.serializeUser((doctor: any, done) => {
    process.nextTick(() => done(null, doctor.id));
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const doctor = await getDoctorById(id);
        done(null, doctor || false);
    } catch (err) {
        done(err);
    }
});

const localLogin = new LocalStrategy(
    { usernameField: 'email', passwordField: 'pwd', passReqToCallback: true },
    async (req: Request, email: string, password: string, done) => {
        console.log("MACHA")
        try {
            let doctor = await getDoctorByEmail(email);

            if (!doctor) {
                return done(null, false, { message: 'Doctor does not exist. Please register first.' });
            } else {
                // Validate existing doctor's password
                const isMatch = await bcrypt.compare(password, doctor.pwd);
                if (!isMatch) {
                    return done(null, false, { message: 'Invalid credentials' });
                }
            }

            return done(null, doctor);
        } catch (err) {
            return done(err);
        }
    }
);

export default passport.use(localLogin);

