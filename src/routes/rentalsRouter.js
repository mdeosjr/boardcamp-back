import { Router } from 'express';
import { getRentals, postRentals, finishRental, deleteRental } from '../controllers/rentalsController.js';
import validateRentals from '../middlewares/validateRentals.js';
import validateId from '../middlewares/validateId.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals', validateRentals, postRentals);
rentalsRouter.post('/rentals/:id/return', validateId, finishRental);
rentalsRouter.delete('/rentals/:id', validateId, deleteRental);

export default rentalsRouter;

