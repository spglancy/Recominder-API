const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./config')
const authController = require('./controllers/authController')
var cookieParser = require('cookie-parser');

//possible fix for unresponsive data
app.use(express.bodyParser({limit: '50mb'}))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());

mongoose.connect(config.mongoURL, { useNewUrlParser: true })
    .catch(err => {
        throw err
    })

app.use('/', authController)

app.listen(config.port, () => {
    console.log(`App running on port ${config.port}`)
})