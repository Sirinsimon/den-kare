import { Router } from 'express';
import * as doctorController from '../controllers/doctor.controller';
import passport from 'passport';

const doctorRouter = Router();

doctorRouter.post('/login', (req, res, next) => {
    console.log("Login Route Hit"); // Add this to check if the request reaches here
    console.log(req.body)
    next();
}, passport.authenticate('local', { session: true }), (req, res) => {
    console.log("HEYY");
    res.status(200).json({ message: 'Login successful', doctor: req.user });
});

doctorRouter.post('/', doctorController.createDoctorController);
doctorRouter.get('/:id', doctorController.getDoctorByIdController);
doctorRouter.get('/', doctorController.getDoctorByEmailController);




export default doctorRouter
