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

app.set('view engine', 'handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressValidator())
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'))
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

app.get('/', (req, res) => {
    const currentUser = req.user;
    if (currentUser) {
        res.redirect(`/home/${req.user._id}`)
    }
    res.redirect('/api/auth/signup')
})

app.get('/home/:id', (req, res) => {
    res.render('home')
})

app.listen(config.port, () => {
    console.log(`App running on port ${config.port}`)
})