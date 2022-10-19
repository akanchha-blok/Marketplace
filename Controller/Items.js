const env = require("dotenv");
env.config();
const connection = require('../Model/Database')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.addItem = async (req, res) => {


    try {
        const { name, price, quantity } = req.body
        if (!name || !price || !quantity) {
            res.status(400).send("Fill all column")
        }
        const user = req.user;
        console.log(user)

        const maxIdQuery = `SELECT DISTINCT id FROM users WHERE email='${user.email}'`
        console.log(maxIdQuery)
        const maxIdResult = await connection.module.client.query(maxIdQuery);
        let id = maxIdResult.rows[0].id

        const query = `INSERT INTO items(item_id,item_name,quantity,price,total_price) VALUES('${id}','${name}','${quantity}','${price}','${quantity * price}')`
        console.log(query)
        const items = await connection.module.client.query(query)
        res.status(200).send("item updated")

        connection.module.client.end;

    }
    catch (err) {
        console.log(err)
    }
}

exports.orderItem = async (req, res) => {
    try {
        const { name, quantity, price, payment } = req.body

        if (!name || !quantity || !price || !payment) {
            res.status(400).send("Please fill all column")
        }
        const user = req.user;
        console.log(user)

        const maxIdQuery = `SELECT DISTINCT id FROM users WHERE email='${user.email}'`
        console.log(maxIdQuery)
        const maxIdResult = await connection.module.client.query(maxIdQuery);
        let id = maxIdResult.rows[0].id

        const query = `INSERT INTO order_items(item_id,item_name,quantity,price,payment) VALUES('${id}','${name}','${quantity}','${price}','${payment}')`
        console.log(query)
        const orderItems = await connection.module.client.query(query)
        const updateQuery = `UPDATE items SET "quantity"=quantity-'${quantity}',"total_price"=(quantity -'${quantity}')*price`
        console.log(updateQuery)
        const updateditems = await connection.module.client.query(updateQuery)
        res.status(200).send("Order placed")
    }
    catch (err) {
        console.log(err)
    }
}

