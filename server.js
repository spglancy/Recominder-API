const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./config')
const expressValidator = require('express-validator')
const jwt = require('jsonwebtoken');
const authController = require('./controllers/authController')
var cookieParser = require('cookie-parser');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressValidator())
app.use(methodOverride('_method'))
app.use(cookieParser());

mongoose.connect(config.mongoURL, { useNewUrlParser: true })
    .catch(err => {
        throw err
    })

app.use('/', authController)

app.listen(config.port, () => {
    console.log(`App running on port ${config.port}`)
})