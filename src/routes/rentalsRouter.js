import { Router } from 'express';
import { getRentals, postRentals, finishRental, deleteRental } from '../controllers/rentalsController.js';
import validateRentals from '../middlewares/validateRentals.js';
import validateId from '../middlewares/validateId.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals', validateRentals, postRentals);
rentalsRouter.use(validateId);
rentalsRouter.post('/rentals/:id/return', finishRental);
rentalsRouter.delete('/rentals/:id', deleteRental);

export default rentalsRouter;

