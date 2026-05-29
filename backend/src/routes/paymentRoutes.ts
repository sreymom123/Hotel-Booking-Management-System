import { Router } from 'express';
import { OperationController } from '../controllers/PaymentController.js';
import { OperationRepository } from '../repositories/PaymentRepository.js';
import { OperationService } from '../services/PaymentService.js';

const masterRouter = Router();

// Object Oriented Dependency Injection Linkage
const repo = new OperationRepository();
const service = new OperationService(repo);
const controller = new OperationController(service);

// Endpoints mapping
masterRouter.post('/checkin', controller.processCheckIn);
masterRouter.post('/checkout', controller.processCheckOut);

export default masterRouter;
