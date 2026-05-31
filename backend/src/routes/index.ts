import { Router } from 'express';
import { PaymentRepository } from '../repositories';
import { PaymentService } from '../services';
import { PaymentController } from '../controllers';

const masterRouter = Router();

// Hook up your architectural components cleanly (Dependency Injection)
const repository = new PaymentRepository();
const service = new PaymentService(repository);
const controller = new PaymentController(service);

// Health check endpoint
masterRouter.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

// Define API Endpoints
masterRouter.post('/checkin', controller.processCheckIn);
masterRouter.post('/checkout', controller.processCheckOut);
masterRouter.get('/payment/:bookingId', controller.getPaymentDetails);


export default masterRouter;