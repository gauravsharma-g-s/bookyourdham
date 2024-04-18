const mongoose = require('mongoose')

const ExtrasSchema = new mongoose.Schema({
    name : String,
    price: Number,
    quantity : Number,
    picturePath:{
        type:String,
        default:""
    },
    basePrice:Number
})

const Extras = mongoose.model('Extras',ExtrasSchema)

module.exports = Extras