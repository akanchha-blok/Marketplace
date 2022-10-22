require("dotenv").config();
const { pool, Client } = require('pg')


const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})






client.connect();


const userTableQuery = `
CREATE TABLE users (
    user_id serial not null primary key,
    name varchar not null,
    gender varchar not null,
    email varchar not null,
    password varchar not null
   
);
`

const userAddressTableQuery =`
CREATE TABLE user_address (
    id serial not null primary key,
    user_id serial not null,
    house_no integer not null,
    city varchar not null,
    state varchar not null,
    country varchar not null,
    pincode integer not null,
    foreign key (user_id) references users(user_id)
   
);
`

const itemsTableQuery = `
CREATE TABLE items (
    item_id serial not null primary key,
    item_name varchar not null,
    quantity integer not null,
    price integer not null
);
`
const orderitemsTableQuery = `
CREATE TABLE order_items (
    user_id  serial not null primary key,
    order_id serial not null,
    item_id serial not null,
    item_name varchar not null,
    quantity integer not null,
    price integer not null,
    payment varchar not null,
    foreign key (user_id) references users(user_id),
    foreign key (item_id) references items(item_id)

   
);
`
createTable(userTableQuery)
createTable(userAddressTableQuery)
createTable(orderitemsTableQuery)
createTable(itemsTableQuery)

async function createTable(query) {
    try {
        const res = await client.query(query);
        console.log('Table is successfully created');
    } catch (err) {
        console.log("already exist")
    }
}

exports.module = { client }