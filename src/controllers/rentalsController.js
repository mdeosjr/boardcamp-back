import connection from '../db.js';
import dayjs from 'dayjs';

export async function getRentals(req, res) {
    try {
        const rentalsArray = await connection.query({
            text: `
                SELECT 
                    rentals.*, 
                    customers.id, customers.name, 
                    games.id, games.name, games."categoryId",
                    categories.name
                FROM rentals 
                    JOIN customers ON customers.id=rentals."customerId"
                    JOIN games ON games.id=rentals."gameId"
                    JOIN categories ON categories.id=games."categoryId"
            `,
            rowMode: 'array'
        });

        const rentalsList = rentalsArray.rows.map(row => {
            const [
                id, customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee,
                idCustomer, nameCustomer,
                idGame, nameGame, categoryId, categoryName
            ] = row;

            return {
                id, customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee,
                customer: {id: idCustomer, name: nameCustomer},
                game: {id: idGame, name: nameGame, categoryId, categoryName}
            }
        });

        res.status(200).send(rentalsList);
    } catch (e) {
        console.error(e)
        res.sendStatus(500);
    }
}

export async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const game = await connection.query(`
            SELECT games.* FROM games
                WHERE games.id=$1
        `, [gameId]);

        const pricePerDay = game.rows[0].pricePerDay;
        const originalPrice = pricePerDay * daysRented;
        const rentDate = dayjs().format('YYYY-MM-DD');
        
        await connection.query(`
            INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
                VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [customerId, gameId, rentDate, daysRented, null, originalPrice, null]);

        res.sendStatus(201);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}

export async function finishRental(req, res) {
    const { id } = req.params;
    const returnDate = dayjs().format('YYYY-MM-DD');

    try {
        const result = await connection.query(`
            SELECT rentals*, games.pricePerDay AS "pricePerDay" FROM rentals
                JOIN games ON games.id=rentals."gameId"
                WHERE rentals.id=$1
        `, [id]);

        const rent = result.rows[0];
        const daysDiff = dayjs().diff(rent.rentDate, 'days');
        const delayFee = daysDiff * rent.pricePerDay;

        await connection.query(`
            UPDATE rentals 
                SET "customerId"=$1, 
                    "gameId"=$2, 
                    "rentDate"=$3, 
                    "daysRented"=$4, 
                    "returnDate"=$5, 
                    "originalPrice"=$6, 
                    "delayFee"=$7
                WHERE id=$8
        `, [
            rent.customerId, 
            rent.gameId, 
            rent.rentDate, 
            rent.daysRented, 
            returnDate, 
            rent.originalPrice, 
            delayFee, 
            id
        ]);

        res.sendStatus(200);
    } catch (e) { 
        console.error(e);
        res.sendStatus(500);
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;

    try {
        await connection.query(`
            DELETE FROM rentals
                WHERE id=$1
        `, [id]);
        res.sendStatus(200);
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
}