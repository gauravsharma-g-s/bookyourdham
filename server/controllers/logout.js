const User = require('../model/User')

const handleLogout = async (req, res) => {
    // On Client Side delete access tokens

    const cookies = req.cookies
    if (!cookies?.bookyourdhamToken) return res.sendStatus(204)          // No content
    const refreshToken = cookies.bookyourdhamToken

    const foundUser = await User.findOne({ refreshToken })
    if (!foundUser) {
        res.clearCookie('bookyourdhamToken', { httpOnly: true, sameSite: 'None' })
        return res.sendStatus(204)          // Succesful but No content
    }

    // Delete the refresh token in database
    await User.findOneAndUpdate({ _id: foundUser._id }, { refreshToken: "" })
    res.clearCookie('bookyourdhamToken', { httpOnly: true, sameSite: 'None' })
    return res.sendStatus(204)
}

module.exports = { handleLogout }