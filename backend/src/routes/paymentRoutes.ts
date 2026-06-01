import { Router } from 'express';
<<<<<<< HEAD
import { PaymentRepository } from '../repositories';
import { PaymentService } from '../services';
import { PaymentController } from '../controllers';
=======
import { PaymentController } from '../controllers/PaymentController.js';
import { PaymentRepository } from '../repositories/PaymentRepository.js';
import { PaymentService } from '../services/PaymentService.js';
>>>>>>> 01ecffbcf659f65de2522c5e7152b9c944e3b2c4

const masterRouter = Router();

// Object Oriented Dependency Injection Linkage
const repo = new PaymentRepository();
const service = new PaymentService(repo);
const controller = new PaymentController(service);

// Endpoints mapping
masterRouter.post('/checkIn', controller.processCheckIn);
masterRouter.post('/checkOut', controller.processCheckOut);
masterRouter.get('/all', controller.getAllPayments);

<<<<<<< HEAD
// 4. Resource Queries Retrieval Routes
masterRouter.get('/details/:bookingId', controller.getPaymentDetails);

=======
>>>>>>> 01ecffbcf659f65de2522c5e7152b9c944e3b2c4
export default masterRouter;
