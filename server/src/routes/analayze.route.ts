import { Router } from 'express';
import * as analyzeController from "../controllers/analayze.controller"

const analyzeRouter = Router();

analyzeRouter.post('/detect', analyzeController.saveDetectedDataController);
analyzeRouter.patch('/past_history', analyzeController.updatePastHistoryController);
analyzeRouter.get('/', analyzeController.getDetectionsFromAppointmentId);

export default analyzeRouter
