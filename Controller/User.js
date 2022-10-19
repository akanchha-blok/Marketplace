
const env = require("dotenv");
env.config();
const connection = require('../Model/Database')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.signup = async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(6);


        const { name, gender, email, password } = req.body;

        if (!name || !gender || !email || !password) {
            throw ("plz filled all detail")
        }

        const password2 = bcrypt.hashSync(password, salt);
        console.log(password2)

        const user = `SELECT email FROM users WHERE email = '${email}'`
        const find = await connection.module.client.query(user)
        if (find.rows.length) {
            throw ("already exist")
        }
        console.log(find)

        const query = `INSERT INTO users(name,gender,email,password)  VALUES('${name}','${gender}','${email}','${password2}')`
        const resp = await connection.module.client.query(query)
        console.log(resp)
        res.status(202).send("INSERT VALUE")

        connection.module.client.end;
    }
    catch (err) {
        //    res.status(500).send(err)
        console.log(err)
    }
}


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({ error: "plz filled all detail" })
        }

        var salt = bcrypt.genSaltSync(6);
        const hash = bcrypt.hashSync(password, salt);
        console.log(hash)

        const user = `SELECT email,password FROM users WHERE email = '${email}'`
        const find = await connection.module.client.query(user)
        if (!find.rows.length) {
            res.status(403).json({ error: "user not find" })
        }
        const match = await bcrypt.compare(password, find.rows[0].password);
        if (match === false) {
            return res.json({ message: "Invalid password" });
        }
        else {
            console.log("Logged In")

        }

        console.log(process.env.JWT_SECRET_KEY);
        const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.EXPIRE_TILL });
        res.status(200).send({ token })

        connection.module.client.end;
    }
    catch (err) {
        console.log(err)
    }

}
exports.valid = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        let token = auth
        if (auth.includes("Bearer")) {
            token = token.split(" ")[1]
            console.log(token)
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decode;
        next();

    }
    catch (err) {
        console.log(err)
        res.status(403).send("invalid token" + err)
    }


}
exports.address = async (req, res) => {
    try {
        const user = req.user;
        console.log(user)
        const { house_no, city, state, country, pincode } = req.body

        if (!house_no || !city || !state || !country || !pincode) {

            return res.status(422).json({ error: "plz filled all detail" })

        }

        const maxIdQuery = `SELECT DISTINCT id FROM users WHERE email='${user.email}'`
        console.log(maxIdQuery)
        const maxIdResult = await connection.module.client.query(maxIdQuery);
        let id = maxIdResult.rows[0].id

        const query = `INSERT INTO user_address(id,house_no,city,state,country,pincode) VALUES ('${id}','${house_no}','${city}','${state}','${country}','${pincode}')`
        console.log(query)
        const view = await connection.module.client.query(query);
        if (view) {
            console.log("updated")
        }
        else {
            res.send('something went to wrong')
        }

        res.send(query)

        connection.module.client.end;
    }
    catch (err) {
        console.log(err)

    }
}

exports.mydetail = async (req, res) => {
    try {
        const user = req.user;
        console.log(user)


        const maxIdQuery = `SELECT DISTINCT id FROM users WHERE email='${user.email}'`
        console.log(maxIdQuery)
        const maxIdResult = await connection.module.client.query(maxIdQuery);
        let id = maxIdResult.rows[0].id

        //   const test = `SELECT id,name,user_address FROM users,user_address WHERE users.email = '${user.email}' AND user_address.id=id`
        // const test = `SELECT id,name FROM detail LEFT JOIN ON address WHERE detail.email = '${user.email}'`
        const test = `SELECT users.id,users."name",user_address FROM users LEFT JOIN user_address ON user_address.id = user.id='${id}' `
        console.log(test)
        const myInfo = await connection.module.client.query(test);
        // res.json(myInfo.rows[0])
        console.log(myInfo)

        if (!myInfo.rows.length) {
            throw ("address not found")
        }

        res.status(202).send({ mydetail: myInfo.rows[0] })

    }
    catch (err) {
        res.status(500).send(err)
    }


}