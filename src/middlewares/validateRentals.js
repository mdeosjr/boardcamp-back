import joi from 'joi';
import connection from '../db.js';

const rentalsSchema = joi.object({
    customerId: joi.number().min(1).required(),
    gameId: joi.number().min(1).required(),
    daysRented: joi.number().min(1).required()
});

export default async function validateRentals(req, res, next) {
    const validation = rentalsSchema.validate(req.body);
    if (validation.error) return res.sendStatus(400);

    const existentCustomer = await connection.query(`
        SELECT * FROM customers
            WHERE id=$1
    `, [req.body.customerId]);
    if (existentCustomer.rows.length === 0) return res.sendStatus(400);

    const existentGame = await connection.query(`
        SELECT * FROM games
            WHERE id=$1
    `, [req.body.gameId]);
    if (existentGame.rows.length === 0) return res.sendStatus(400);

    const availableGames = await connection.query(`
        SELECT rentals.*, games."stockTotal"
            FROM rentals
            JOIN games ON games.id=rentals."gameId"
            WHERE rentals."returnDate" IS NULL
    `)
    
    if (availableGames.rowCount === 0) return next();
    if (availableGames.rows.length > availableGames.rows[0].stockTotal) return res.sendStatus(400); 

    next();
}
