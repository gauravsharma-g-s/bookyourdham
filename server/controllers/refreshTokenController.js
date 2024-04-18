const jwt = require('jsonwebtoken')
const User = require('../model/User')
require('dotenv').config()

const handleRefreshToken = async (req,res) => {
    console.log("handlerefresh")
    const cookies = req.cookies
    console.log(cookies.bookyourdhamToken)
    if(!cookies?.bookyourdhamToken) return res.sendStatus(401)

    const refreshToken = cookies.bookyourdhamToken

    const foundUser = await User.findOne({refreshToken})
    if(!foundUser){
        return res.sendStatus(403)              // Forbidden
    }
    else{
        jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,decodedInfo)=>{
            console.log(decodedInfo)
            if(err || foundUser._id != decodedInfo.id){
                return res.sendStatus(403)
            }
            const accessToken = jwt.sign(
                {
                    id: decodedInfo.id
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            
            res.json({accessToken})
        })
    }
}


module.exports = {handleRefreshToken}