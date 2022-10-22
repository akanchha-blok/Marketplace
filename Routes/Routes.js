const User = require('../Controller/User')
const Items = require('../Controller/Items')
const express = require('express')
const Router = express.Router();


Router.post('/signup',User.signup)

Router.post('/login',User.login)

Router.post('/address',[User.valid],User.address)

Router.get('/detail',[User.valid],User.mydetail)

Router.post('/items',[User.valid],Items.addItem)

Router.post('/order',[User.valid],Items.orderItem)

Router.get('/myorder',[User.valid],Items.myOrder)






module.exports =Router;