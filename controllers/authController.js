const dotenv = require('dotenv').config()
const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const Data = require('../models/data')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')

//saving HealthKit data from mobile app and echoing it back
router.post('/data', (req, res) => {
    const data = new Data(req.body)
    data.save().then((data) => {
        res.send(data)
    })
})

// checks user auth and logs in
router.post("/login", (req, res) => {
    const email = req.body.email.toLowerCase()
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
                var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" })
                return res.status(200).send({
                    Status: "Successful",
                    userId: user._id,
                    token: token
                })
            })
        })
        .catch(err => {
            console.log(err)
        })
})

// Register route for mobile, will return success or error messages and create users
router.post('/register', (req, res) => {
    const email = req.body.email
    var user = new User(req.body)
    user.email = user.email.toLowerCase()
    User.findOne({ email }).then(check => {
        if(!check){
            user.save().then((user) => {
                // creating token for web based clients
                var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" })
                return res.send({ 
                    status: "Success",
                    userId: user._id,
                    token: token
                })
            })
        } else {
            return res.send({
                status: "Unsuccessful",
                message: "This Email is already in use",
            })  
      }
    })
})


module.exports = router