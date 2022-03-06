import connection from '../db.js';

export async function getGames(req, res) {
    const query = req.query.name;

    try {
        if (query) {
            const gamesList = await connection.query(`
                SELECT games.*, categories.name as "categoryName" FROM games
                    JOIN categories
                    ON games."categoryId"=categories.id
                    WHERE LOWER(games.name) LIKE $1%
            `, [query]);
            res.status(200).send(gamesList.rows);
        }

        const gamesList = await connection.query(`
            SELECT games.*, categories.name as "categoryName" FROM games
                JOIN categories
                ON games."categoryId"=categories.id
        `);

        res.status(200).send(gamesList.rows);
    } catch(e) {
        console.error(e)
        res.sendStatus(500);
    }
}

export async function postGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        await connection.query(`
            INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") 
                VALUES ($1, $2, $3, $4, $5)
        `, [name, image, stockTotal, categoryId, pricePerDay]);
        res.sendStatus(201);
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
}