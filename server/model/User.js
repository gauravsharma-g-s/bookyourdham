const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        admin: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            required: true,
            min: 3,
            max: 50
        },
        phone: {
            type: Number
        },
        password: {
            type: String,
            required: true,
            min: 5
        },
        email: {
            type: String,
            min: 6,
            max: 30,
            unique: true,
            required: true
        },
        picturePath: {
            type: String,
            default: ""
        },
        address: {
            type: String,
            min: 10,
            max: 80
        },
        district: {
            type: String,
            min: 2,
            max: 20
        },
        state: {
            type: String,
            min: 2,
            max: 20
        },
        pin: {
            type: Number,
            min: 1000,
            max: 9999
        },
        refreshToken: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', UserSchema)
module.exports = User