const Users = require('../models/userModel')
const Payments = require('../models/paymentModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userCtrl = {
    register: async (req, res) => {
        try {

            //Grabs the name, email, and password
            const { name, password, email } = req.body;

            //Checks for an existing user
            const user = await Users.findOne({email})

            //If user/email already exists, send error
            if (user) {
                return res.status(400).json({msg: "Email already exists"});
            }

            //If password is shorter than 6 characters
            if (password.length < 6) {
                return res.status(400).json({msg: "Password must be at least 6 characters"})
            }

            //Hash the password
            const passwordHash = await bcrypt.hash(password, 10)

            //Creates a new user
            const newUser = new Users({
                name, email, password: passwordHash
            })

            //Saves the new user
            await newUser.save()

            //Creates an access and refresh token
            const accesstoken = createAccessToken({id: newUser._id})
            const refreshtoken = createRefreshToken({id: newUser._id})
            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/users/refresh_token',
                maxAge: 7*24*60*60*1000  //7d
            })
            
            //Sends the accesstoken in the response
            res.json(accesstoken)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req, res) => {
        try {

            //Grab the email and password
            const { email, password } = req.body

            //Check to see if a user exists with that email
            const user = await Users.findOne({email})

            //If no user is found, send an error
            if (!user) res.status(400).json({msg: "User does not exist."})

            //Check to see if the password inserted is correct
            const isMatch = await bcrypt.compare(password, user.password)

            //If the password is incorrect, send an error
            if (!isMatch) res.status(400).json({msg: "Incorrect password"})

            //If login is successful, create access token and refresh token
            const accesstoken = createAccessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})

            //Adds the refresh token as a cookie
            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/users/refresh_token',
                maxAge: 7*24*60*60*1000  //7d
            })

            return res.json({accesstoken})

        } catch (err) {
            throw err;
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/users/refresh_token'})
            return res.json({msg: "User logged out"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUser: async (req, res) => {
        try {
            //Grabs the user from mongo using the id set from the request header
            const user = await Users.findById(req.user.id).select('-password')

            //If a user is invalid, send an error
            if (!user) res.status(400).json({msg: "User does not exist"})

            //Sends information back to client
            res.json(user)
        } catch (err) {
            res.status(500).json({msg: msg.error})
        }
    },
    refreshToken: (req, res) => {
        try {
            //Grabs the refresh token from the cookies
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({msg: "Please Login or Register"})

            //Verifies the refresh token is for this specific user
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({msg: "Please Login or Register"})

                const accesstoken = createAccessToken({id: user.id})

                res.json({user, accesstoken})
            })


        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    addCart: async (req, res) => {
        try {
            user = await Users.findById(req.user.id)

            if (!user) return res.status(400).json({msg: "User does not exist"})

            await Users.findOneAndUpdate({_id: req.user.id}, {
                cart: req.body.cart
            })

            return res.json({msg: "Added to cart"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    history: async (req, res) => {
        try {
            const history = await Payments.find({user_id: req.user.id})

            res.json(history)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

//Creates an access token using jsonwebtoken
const createAccessToken = user => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11m' })
}

const createRefreshToken = user => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userCtrl