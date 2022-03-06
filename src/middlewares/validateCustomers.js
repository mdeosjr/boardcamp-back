import joi from 'joi';
import connection from '../db.js';

const customersSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().alphanum().min(10).max(11).required(),
    cpf: joi.string().alphanum().length(11).required(),
    birthday: joi.date().min('now').required()
});

export default async function validateCustomers(req, res, next) {
    const validation = customersSchema.validate(req.body);
    if (validation.error) return res.sendStatus(400);

    const existentCustomer = await connection.query(`
            SELECT * FROM customers 
                WHERE cpf=$1
                LIMIT 1
        `, [req.body.cpf]);
    if (existentCustomer.rows.length === 0) return res.sendStatus(409);

    next();
}