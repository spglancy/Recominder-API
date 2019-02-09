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

var checkAuth = (req, res, next) => {
    console.log("Authenticating");
    if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
        req.user = null;
    } else {
        var token = req.cookies.nToken;
        var decodedToken = jwt.decode(token, { complete: true }) || {};
        req.user = decodedToken.payload;
    }

    next();
};
app.use(checkAuth);

mongoose.connect(config.mongoURL, { useNewUrlParser: true })
    .catch(err => {
        throw err
    })

app.use('/', authController)

app.listen(config.port, () => {
    console.log(`App running on port ${config.port}`)
})