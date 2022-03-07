import connection from '../db.js';

export async function getGames(req, res) {
    const { offset, limit, name } = req.query;
    let OFFSET = '';
    let LIMIT = '';

    if (offset) {
        OFFSET = `OFFSET ${sqlstring.escape(offset)}`;
    }

    if (limit) {
        LIMIT = `LIMIT ${sqlstring.escape(limit)}`
    }

    try {
        if (name) {
            const gamesList = await connection.query(`
                SELECT games.*, categories.name as "categoryName" FROM games
                    JOIN categories
                    ON games."categoryId"=categories.id
                    WHERE LOWER(games.name) LIKE $1
            `, [`${name}%`]);
            res.status(200).send(gamesList.rows);
        }

        const gamesList = await connection.query(`
            SELECT games.*, categories.name as "categoryName" FROM games
                JOIN categories
                ON games."categoryId"=categories.id
                ${OFFSET}
                ${LIMIT}    
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
        `, [name, image, stockTotal, categoryId, (pricePerDay*100)]);
        res.sendStatus(201);
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
}