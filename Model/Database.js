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
    id serial not null primary key,
    name varchar not null,
    gender varchar not null,
    email varchar not null,
    password varchar not null
   
);
`

const userAddressTableQuery = `
CREATE TABLE user_address (
    id serial not null primary key,
    house_no integer not null,
    city varchar not null,
    state varchar not null,
    country varchar not null,
    pincode integer not null,
    foreign key (id) references users(id)
   
);`

const itemsTableQuery = `
CREATE TABLE items (
    item_id serial not null primary key,
    item_name varchar not null,
    quantity integer not null,
    price integer not null,
    total_price integer not null,
    foreign key (item_id) references users(id)
   
);`
const orderitemsTableQuery = `
CREATE TABLE order_items (
    item_id serial not null primary key,
    item_name varchar not null,
    quantity integer not null,
    price integer not null,
    payment varchar not null,
    foreign key (item_id) references users(id)
   
);`
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