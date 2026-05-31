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
masterRouter.post('/checkIn', controller.processCheckIn);
masterRouter.post('/checkOut', controller.processCheckOut);
masterRouter.get('/all', controller.getAllPayments);

// 4. Resource Queries Retrieval Routes
masterRouter.get('/details/:bookingId', controller.getPaymentDetails);

export default masterRouter;
