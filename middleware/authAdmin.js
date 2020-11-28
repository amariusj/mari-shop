const Users = require('../models/userModel')

const authAdmin = async (req, res, next) => {
    try {
        //Find the user
        const user = await Users.findById(req.user.id)

        //Check to see if they have admin access
        if (user.role === 0) return res.status(400).json({msg: "Admin resources access denied"})

        //If user is admin, allow access to next route
        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authAdmin