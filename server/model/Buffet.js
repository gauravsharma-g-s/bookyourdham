const mongoose = require('mongoose')

const BuffetSchema = new mongoose.Schema({
    name:String,
    dishes: {
        type: Array,
        default: []
    },
    quantity: Number,
    price: Number,
    picturePath: {
        type: String,
        default: ""
    }
})

const Buffet = mongoose.model('Buffet', BuffetSchema)

module.exports = Buffet