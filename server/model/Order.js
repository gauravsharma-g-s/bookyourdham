const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    userId: String,
    userEmail: {
        type: String,
        required: true
    },
    name:String,
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        min: 100000,
        max: 999999
    },
    items: [{
        itemId: {
            type: String,
            required: true
        },
        count:Number,
        picturePath:String,
        name:String,
        itemType:String,
        quantity:Number
    }],
    time: String,
    date: String,
    paid: { type: Boolean, default: false },
    transactionMode: String,
    delivered: { type: Boolean, default: false },
    cancelled: { type: Boolean, default: false },
    totalPrice:Number
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order