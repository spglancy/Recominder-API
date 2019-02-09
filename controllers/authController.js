const dotenv = require('dotenv').config()
const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const Data = require('../models/data')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')

/**
 * Renders Signup template
 */
router.get('/signup', (req, res) => {
    const x = req.nToken
    if (x) {
        res.redirect(`/home/${x._id}`)
    }
    res.render('signup')
})

/**
 * Renders login page
 */

router.get('/login', (req, res) => {
    res.render('login')
})

/**
 *  Registers new user
 */

router.post('/register', (req, res) => {
    const email = req.body.email
    var user = new User(req.body)
    User.findOne({ email }).then(check => {
        if(!check){
            user.save().then((user) => {
                var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" })
                res.cookie('nToken', token, { maxAge: 900000, httpOnly: true })
                res.redirect(`/home/${user._id}`)
            })
        } else {
            res.send("This Email is already in use")
        }
    })
    
})

// clears cookie
router.get('/logout', (req, res) => {
    res.clearCookie('nToken')
    res.redirect('/')
})

// checks user auth and logs in
router.post("/login", (req, res) => {
    const email = req.body.email
    const password = req.body.password
    // Find this user name
    User.findOne({ email }, "email password")
        .then(user => {
            if (!user) {
                // User not found
                return res.status(401).send({ 
                    Status: "Unsuccessful",
                    Message: "Wrong Email or Password" 
                 })
            }
            // Check the password
            user.comparePassword(password, (err, isMatch) => {
                if (!isMatch) {
                    // Password does not match
                    return res.status(401).send({
                        Status: "Unsuccessful",
                        Message: "Wrong Email or Password"
                })
                }
                // Create a token
                const token = jwt.sign({ _id: user._id, email: user.email, name: user.name }, process.env.SECRET, {
                    expiresIn: "60 days"
                })
                // Set a cookie and redirect to root
                res.cookie("nToken", token, { maxAge: 900000, httpOnly: true })
                res.redirect(`/home/${user._id}`)
            })
        })
        .catch(err => {
            console.log(err)
        })
})

// Mobile Routes

//saving HealthKit data from mobile app and echoing it back
router.post('/data', (req, res) => {
    const data = new Data(req.body)
    data.save().then((data) => {
        res.send(data)
    })
})

// checks user auth and logs in
router.post("/mobile-login", (req, res) => {
    const email = req.body.email
    const password = req.body.password
    // Find this user name
    User.findOne({ email }, "email password")
        .then(user => {
            if (!user) {
                // User not found
                return res.status(401).send({ 
                    Status: "Unsuccessful",
                    message: "Wrong Email or Password" 
                 })
            }
            // Check the password
            user.comparePassword(password, (err, isMatch) => {
                if (!isMatch) {
                    // Password does not match
                    return res.status(401).send({ 
                        Status: "Unsuccessful",
                        message: "Wrong Email or Password" 
                     })
                }
                return res.status(200).send({
                    Status: "Successful",
                    userId: user._id
                })
            })
        })
        .catch(err => {
            console.log(err)
        })
})

// Register route for mobile, will return success or error messages and create users
router.post('/mobile-register', (req, res) => {
    const email = req.body.email
    var user = new User(req.body)
    User.findOne({ email }).then(check => {
        if(!check){
            user.save().then((user) => {
                return res.send({ 
                    status: "Success",
                    userId: user._id
                })
            })
        } else {
            return res.send({
                status: "Unsuccessful",
                message: "This Email is already in use"
            })  
      }
    })
})


module.exports = router