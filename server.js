const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./config')
const authController = require('./controllers/authController')
let cookieParser = require('cookie-parser');

app.use(bodyParser.json())
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