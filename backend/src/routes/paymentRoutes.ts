import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController.js';
import { PaymentRepository } from '../repositories/PaymentRepository.js';
import { PaymentService } from '../services/PaymentService.js';

const masterRouter = Router();

// Object Oriented Dependency Injection Linkage
const repo = new PaymentRepository();
const service = new PaymentService(repo);
const controller = new PaymentController(service);

// Endpoints mapping
masterRouter.post('/checkin', controller.processCheckIn);
masterRouter.post('/checkout', controller.processCheckOut);

export default masterRouter;
