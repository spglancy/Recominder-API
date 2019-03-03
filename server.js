const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./config')
const authController = require('./controllers/authController')
const cors = require('cors')
let cookieParser = require('cookie-parser')

// cors protocols? fix I dont understand fully
app.use(cors())
app.use(bodyParser.json({ limit: '200mb' }))
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }))
app.use(cookieParser())

mongoose.connect(config.mongoURL, { useNewUrlParser: true })
    .catch(err => {
        throw err
    })

app.use('/', authController)

app.listen(config.port, () => {
    console.log(`App running on port ${config.port}`)
})