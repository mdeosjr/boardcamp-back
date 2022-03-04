import { Router } from 'express';
import { getCustomers, getCustomer, postCustomers } from '../controllers/customersController.js';

const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getCustomer);
customersRouter.post('/customers', postCustomers);

export default customersRouter;