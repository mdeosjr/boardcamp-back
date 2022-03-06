import { Router } from 'express';
import { getCustomers, getCustomer, postCustomers, updateCustomer } from '../controllers/customersController.js';
import validateCustomers from '../middlewares/validateCustomers.js';

const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getCustomer);
customersRouter.post('/customers', validateCustomers, postCustomers);
customersRouter.put('/customers/:id', validateCustomers, updateCustomer);

export default customersRouter;