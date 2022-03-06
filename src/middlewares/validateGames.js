import joi from 'joi';
import connection from '../db.js';

const gamesSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
    stockTotal: joi.number().min(1).required(),
    categoryId: joi.number().required(),
    pricePerDay: joi.number().min(1).required()
});

export default async function validateGames(req, res, next) {
    const validation = gamesSchema.validate(req.body);
    if (validation.error) return res.sendStatus(400);

    const existentCategory = await connection.query(`
            SELECT * FROM categories 
                WHERE name=$1
                LIMIT 1
        `, [req.body.categoryId]);
    if (existentCategory.rows.length !== 0) return res.sendStatus(400);

    const existentGame = await connection.query(`
            SELECT * FROM games 
                WHERE name=$1 
                LIMIT 1
        `, [req.body.name]);
    if(existentGame.rows.length !== 0) return res.sendStatus(409);

    next();
}