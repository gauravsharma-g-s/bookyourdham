const mongoose = require('mongoose')

const UserOtpVerificationSchema = new mongoose.Schema({
    email:String,
    otp:String,
    createdAt : Date,
    expiredAt : Date
})

const UserOtpVerification = mongoose.model('UserOtpVerification',UserOtpVerificationSchema)

module.exports = UserOtpVerification