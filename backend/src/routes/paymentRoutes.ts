import { Router } from 'express';
import { OperationRepository } from '../repositories';
import { OperationService } from '../services';
import { OperationController } from '../controllers';

const masterRouter = Router();

// Object Oriented Dependency Injection Linkage
const repo = new OperationRepository();
const service = new OperationService(repo);
const controller = new OperationController(service);

// Endpoints mapping
masterRouter.post('/checkin', controller.processCheckIn);
masterRouter.post('/checkout', controller.processCheckOut);

export default masterRouter;