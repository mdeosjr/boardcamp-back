import { Router } from 'express';
import { getCustomers, getCustomer, postCustomers, updateCustomer } from '../controllers/customersController.js';

const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getCustomer);
customersRouter.post('/customers', postCustomers);
customersRouter.put('/customers/:id', updateCustomer);

export default customersRouter;