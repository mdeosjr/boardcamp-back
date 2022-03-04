import connection from '../db.js';

export async function getCustomers (req, res) {
    const query = req.query.cpf;

    try {
        if (query) {
            const customersList = await connection.query(`
                SELECT * FROM customers
                    WHERE cpf LIKE '$1%'
            `, [query]);
            res.status(200).send(customersList.rows);
        }

        const customersList = await connection.query('SELECT * FROM customers');
        res.status(200).send(customersList.rows);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}

export async function getCustomer (req, res) {
    const id = req.params.id;

    try {
        const customer = await connection.query(`
            SELECT * FROM customers 
                WHERE id=$1
                LIMIT 1
        `, [id]);
        if (customer.rows.length === 0) return res.sendStatus(404);

        res.status(200).send(customer.rows);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}

export async function postCustomers (req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const existentCustomer = await connection.query(`
            SELECT * FROM customers 
                WHERE cpf=$1
                LIMIT 1
        `, [cpf]);
        if (existentCustomer) return res.sendStatus(409);

        await connection.query(`
            INSERT INTO customers (name, phone, cpf, birthday)
                VALUES ('$1', '$2', '$3', '$4')
        `, [name, phone, cpf, birthday]);
        res.sendStatus(201);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}