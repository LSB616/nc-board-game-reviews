const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const db = require("../db/connection");

const protect = asyncHandler(async (req, res, next) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
          token = req.headers.authorization.split(' ')[1]
          
          const decoded = jwt.verify(token, process.env.JWT_SECRET)

          req.user = await db
          .query(`SELECT * FROM users WHERE username = $1`, [decoded.username])
          .then(({ rows }) => rows[0])
          .select('-password')

          next()

        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not authorized')
        }

        if(!token) {
            res.status(401)
            throw new Error('Not authorized, no token')
        }
    }
})

module.exports = { protect }