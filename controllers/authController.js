const dotenv = require('dotenv').config()
const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const Data = require('../models/data')
const bcrypt = require('bcryptjs')

//saving HealthKit data from mobile app and echoing it back
router.post('/data', (req, res) => {
    const data = new Data(req.body)
    data.save().then((data) => {
        res.json(data)
    }).catch((err) => {
        res.send(err)
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
                return res.status(401).json({ 
                    Status: "Unsuccessful",
                    message: "Wrong Email or Password" 
                 })
            }
            // Check the password
            user.comparePassword(password, (err, isMatch) => {
                if (!isMatch) {
                    // Password does not match
                    return res.status(401).json({ 
                        result: "Unsuccessful",
                        message: "Wrong Email or Password" 
                     })
                }
                var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" })
                return res.status(200).json({
                    result: "Success",
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
    console.log(req.body.email)
    console.log(req.body.password)
    console.log(req.body.passwordConf)
    const email = req.body.email
    const pwd = req.body.password
    const pwdconf = req.body.passwordConf
    if(pwd === pwdconf){
        var user = new User(req.body)
    } else {
        return res.send({message: "Passwords do not match"})
    }
    user.email = user.email.toLowerCase()
    User.findOne({ email }).then(check => {
        if(!check){
            user.save().then((user) => {
                // creating token for web based clients
                var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" })
                res.json({ 
                    result: "Success",
                    userId: user._id,
                    token: token
                })
            })
        } else {
            res.json({
                result: "Unsuccessful",
                message: "This Email is already in use",
            })  
      }
    })
})


module.exports = router