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

        const query = `INSERT INTO items(item_id,item_name,quantity,price) VALUES('${user.user_id}','${name}','${quantity}','${price}')`
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
        const { item, payment,quantity_item} = req.body

        if (!item || !payment || !quantity_item)  {
            res.status(400).send("Please fill all column")
        }
        const user = req.user;
        console.log(user)

        const itemQuery = `SELECT * FROM items WHERE item_id = '${item}'`
        const getItem = await connection.module.client.query(itemQuery)
        if(!getItem.rows[0]){
            return res.status(404).send({message:"item not found"})
        }
        const {item_name, quantity, price} = getItem.rows[0]
        const query = `INSERT INTO order_items(user_id,item_id,item_name,quantity,price,payment) VALUES('${user.user_id}','${item}','${item_name}','${quantity_item}','${price}','${payment}')`
        console.log(query)
        const orderItems = await connection.module.client.query(query)
        const updateQuery = `UPDATE items SET "quantity"=quantity-'${quantity_item}'`
        console.log(updateQuery)
        const updateditems = await connection.module.client.query(updateQuery)
        res.status(200).send("Order placed")
    }
    catch (err) {
        console.log(err)
    }
}

exports.myOrder = async (req,res)=>{
    try{
     const {user_id} = req.user

     const query = `SELECT order_items.order_id,order_items.item_name,order_items.quantity,order_items.price,order_items.payment, user_address FROM order_items  JOIN users ON order_items.user_id = users.user_id JOIN user_address ON users.user_id = user_address.user_id WHERE order_items.user_id ='${user_id}'`
     const myOrder = await connection.module.client.query(query)
    //  console.log(myOrder)
     res.status(200).send(myOrder.rows[0])
    }
    catch(err){
        console.log(err)
        return res.status(404).send({error: err.message})
    }
}

