const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader) return res.sendStatus(401)
    console.log(authHeader)                     // Bearer Token
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded)=>{
            if(err) return res.sendStatus(400); // Invalid Token
            req.user = decoded
            next()
        }
    )
}

module.exports = verifyJWT