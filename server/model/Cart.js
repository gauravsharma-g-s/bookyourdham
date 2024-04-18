const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    items: [{
        itemId: {
            type: String,
            required: true
        },
        price: Number,
        count: {
            type: Number,
            default: 1
        },
        picturePath:String,
        name:String,
        basePrice:Number,
        itemType:String,
        quantity:Number,
        minquantity:Number
    }
    ]
}, {
    timestamps: true
})

const Cart = mongoose.model('Cart', CartSchema)

module.exports = Cart