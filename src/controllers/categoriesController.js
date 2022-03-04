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
        if (category === '') return res.sendStatus(400);

        const existentCategory = await connection.query(`
            SELECT * FROM categories 
                WHERE name='$1' 
                LIMIT 1
        `, [category]);
        if (existentCategory) return res.sendStatus(409);

        await connection.query(`
            INSERT INTO categories (name) 
                VALUES ('$1')
        `, [category]);
        res.sendStatus(201);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}