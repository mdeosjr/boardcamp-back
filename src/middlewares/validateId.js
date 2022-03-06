import connection from '../db.js';

export default async function validateId(req, res, next) {
    const { id } = req.params;

    const existentId = await connection.query(`
        SELECT * FROM rentals 
            WHERE id=$1
    `, [id]);

    if (existentId.rows.length === 0) return res.sendStatus(404);

    if(existentId.rows[0].returnDate !== null) return res.sendStatus(400);

    next();
}