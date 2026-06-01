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

// Define Unified Endpoint Routes
// All operations work directly at http://localhost:5000 with different HTTP methods
masterRouter.post('/', controller.processCheckIn);              // POST http://localhost:5000
masterRouter.post('/checkout', controller.processCheckOut);    // POST http://localhost:5000/checkout
masterRouter.get('/', controller.getAllPayments);               // GET http://localhost:5000
masterRouter.get('/booking/:bookingId', controller.getPaymentDetails); // GET http://localhost:5000/booking/:id
masterRouter.get('/:paymentId', controller.getPaymentById);     // GET http://localhost:5000/:id
masterRouter.put('/:paymentId', controller.updatePayment);      // PUT http://localhost:5000/:id
masterRouter.delete('/:paymentId', controller.deletePayment);   // DELETE http://localhost:5000/:id

export default masterRouter;