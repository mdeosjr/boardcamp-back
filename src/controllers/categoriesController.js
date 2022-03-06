import connection from '../db.js';

export async function getCategories(req, res) {
    try {
        const categories = await connection.query('SELECT * FROM categories');
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