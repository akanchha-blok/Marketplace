const env =require("dotenv");
env.config();

const express = require('express');
const App = express();
let PORT =  process.env.PORT;

const Routers = require('./Routes/Routes')
const bodyParser = require('body-parser')
App.use(bodyParser.urlencoded({ extended: false }));
App.use(express.json());





App.use('/',Routers)










App.listen(PORT,()=>{
    console.log("server run:",PORT)
})