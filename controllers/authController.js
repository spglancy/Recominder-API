const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

/**
 * Renders Signup template
 */
router.get('/signup', (req, res) => {
    const x = req.nToken;
    if (x) {
        res.redirect(`/home/${x._id}`)
    }
    res.render('signup');
})

/**
 * Renders login page
 */

router.get('/login', (req, res) => {
    res.render('login');
})

/**
 *  Registers new user
 */

router.post('/register', (req, res) => {
    var user = new User(req.body);
    user.save().then((user) => {
        var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" });
        res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
        res.redirect(`/home/${user._id}`);
    });
});

//echos inputs
router.post('/data', (req, res) => {
    res.send(req.body)
});

// clears cookie
router.get('/logout', (req, res) => {
    res.clearCookie('nToken');
    res.redirect('/');
});

// checks user auth and logs in
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // Find this user name
    User.findOne({ email }, "email password")
        .then(user => {
            if (!user) {
                // User not found
                return res.status(401).send({ message: "Wrong Email or Password" });
            }
            // Check the password
            user.comparePassword(password, (err, isMatch) => {
                if (!isMatch) {
                    // Password does not match
                    return res.status(401).send({ message: "Wrong Email or Password" });
                }
                // Create a token
                const token = jwt.sign({ _id: user._id, email: user.email, name: user.name }, process.env.SECRET, {
                    expiresIn: "60 days"
                });
                // Set a cookie and redirect to root
                res.cookie("nToken", token, { maxAge: 900000, httpOnly: true });
                res.redirect(`/home/${user._id}`);
            });
        })
        .catch(err => {
            console.log(err);
        });
});

module.exports = router;