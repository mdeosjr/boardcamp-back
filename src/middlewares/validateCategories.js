import joi from 'joi';
import connection from '../db.js';

const categoriesSchema = joi.object({
    name: joi.string().required()
});

export default async function validateCategories(req, res, next) {
    const validation = categoriesSchema.validate(req.body);
    if (validation.error) return res.sendStatus(400);

    const existentCategory = await connection.query(`
            SELECT * FROM categories 
                WHERE name=$1
                LIMIT 1
        `, [req.body.name]);
    if (existentCategory.rows.length !== 0) return res.sendStatus(409);

    next();
}