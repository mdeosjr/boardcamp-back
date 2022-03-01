import connection from '../db.js';

export async function getCategories(req, res) {
    try {
        const categories = await connection.query('SELECT * FROM categories');

        if (!categories) return res.status(401);

        res.status(200).send(categories.rows);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}

export async function postCategories(req, res) {
    const category = req.body.name;

    try {
        if (category === '') return res.status(400);

        const existentCategory = await connection.query(`
            SELECT * FROM categories 
                WHERE name='${category}' 
                LIMIT 1
        `);
        if (existentCategory) return res.sendStatus(409);

        await connection.query(`
            INSERT INTO categories (name) 
                VALUES ('${category}')
        `);
        res.sendStatus(201);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}