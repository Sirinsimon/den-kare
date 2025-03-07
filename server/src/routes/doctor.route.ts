import { Router } from 'express';
import * as doctorController from '../controllers/doctor.controller';
import passport from 'passport';

const doctorRouter = Router();

doctorRouter.post('/login', (req, res, next) => {
    next();
}, passport.authenticate('local', { session: true }), (req, res) => {
    res.status(200).json({ message: 'Login successful', doctor: req.user });
});

doctorRouter.get('/appointments', doctorController.fetchAllAppointmentsController);
doctorRouter.post('/', doctorController.createDoctorController);
doctorRouter.get('/:id', doctorController.getDoctorByIdController);



export default doctorRouter
