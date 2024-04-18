const mongoose = require('mongoose')

const MenuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    price: Number,
    quantity: Number,
    picturePath:{
        type:String,
        default:""
    },
    basePrice:Number
})

const MenuItem = mongoose.model('MenuItem', MenuItemSchema)

module.exports = MenuItem