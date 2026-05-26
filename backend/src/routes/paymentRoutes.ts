import { Router } from 'express';
import { PaymentRepository } from '../repositories';
import { PaymentService } from '../services';
import { PaymentController } from '../controllers';

const masterRouter = Router();

// Object Oriented Dependency Injection Linkage
const repo = new PaymentRepository();
const service = new PaymentService(repo);
const controller = new PaymentController(service);

// Endpoints mapping
masterRouter.post('/checkin', controller.processCheckIn);
masterRouter.post('/checkout', controller.processCheckOut);

export default masterRouter;
