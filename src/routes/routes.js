import { Router } from 'express';
import categoriesRouter from './categoriesRouter.js';
import gamesRouter from './gamesRouter.js';
import customersRouter from './customersRouter.js';
import rentalsRouter from './rentalsRouter.js';

const router = Router();

router.use(categoriesRouter);
router.use(gamesRouter);
router.use(customersRouter);
router.use(rentalsRouter);

export default router;