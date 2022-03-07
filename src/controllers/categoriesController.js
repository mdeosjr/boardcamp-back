import connection from '../db.js';

export async function getCategories(req, res) {
    const { offset, limit } = req.query;
    let OFFSET = '';
    let LIMIT = '';

    if (offset) {
        OFFSET = `OFFSET ${sqlstring.escape(offset)}`;
    }

    if (limit) {
        LIMIT = `LIMIT ${sqlstring.escape(limit)}`
    }

    try {
        const categories = await connection.query(`
            SELECT * FROM categories
            ${OFFSET}
            ${LIMIT}
        `);
        res.status(200).send(categories.rows);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}

export async function postCategories(req, res) {
    const category = req.body.name;

    try {
        await connection.query(`
            INSERT INTO categories (name) 
                VALUES ($1)
        `, [category]);
        res.sendStatus(201);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}