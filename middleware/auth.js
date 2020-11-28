const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try {
        //Grabs the existing token from the Authorization header
        const token = req.header("Authorization")

        //If no token exists, return an error message
        if (!token) res.status(400).json({msg: "Invalid Authentication"})

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(400).json({msg: "Invalid Authentication"})

            req.user = user     
            next()
        })

    } catch (err) {
        res.status(500).json({msg: err.message})
    }
}

module.exports = auth