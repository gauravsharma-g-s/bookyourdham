const Extras = require('../model/Extras')
const cloudinary = require('cloudinary')
require('dotenv').config()

/* CONFIGURING THE CLOUDINARY FOR IMAGE UPLOAD */
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Uploading image to Cloudinary
async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, function(res){console.log("Image uploaded");},{
        folder: "extras",
        resource_type: "auto",
    });
    return res;
}

// Deleting image from the cloudinary
async function handleDelete(picturePath) {
    await cloudinary.uploader.destroy(picturePath)
}

// Creating a new Menu Item
const createExtra = async (req, res) => {
    try {
        const { name, price, quantity } = req.body
        const priceInt = parseInt(price)
        const quantityInt = parseInt(quantity)
        if (!name || !price || !quantity) res.status(400).json({ "msg": "Please provide all details of dish!" })
        const basePrice = priceInt/quantityInt

        let response = null
        // image storing
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64")
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64
            response = await handleUpload(dataURI)
        }
        const picturePath = response?.public_id ? response.public_id : ""
        const newItem = new Extras({ name, price: priceInt, quantity: quantityInt, picturePath,basePrice })

        await newItem.save()
        const allExtras = await Extras.find()
        res.status(201).json(allExtras)
    }
    catch (err) {
        res.status(409).json({ message: err.message })
    }
}


// Editing a Extra

const editExtra = async (req, res) => {
    try {
        const { id, name, price, quantity } = req.body
        const priceInt = parseInt(price)
        const quantityInt = parseInt(quantity)
        if (!name || !price || !quantity) res.status(400).json({ "msg": "Please provide all details of dish!" })
        const basePrice = priceInt/quantityInt

        let response = null
        // image storing
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64")
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64
            response = await handleUpload(dataURI)
        }

        let foundExtra = await Extras.find({ _id: id })
        let picturePath = foundExtra.picturePath
        if (response && response.public_id) {
            if (picturePath && picturePath !== "")
                handleDelete(picturePath)
            picturePath = response.public_id
        }
        const updatedItem = await Extras.findByIdAndUpdate(id, { name, price: priceInt, quantity: quantityInt, picturePath, basePrice }, { new: true })

        res.json(updatedItem)
    }
    catch (err) {
        res.status(409).json({ message: err.message })
    }
}

// Deleting Extra
const deleteExtra = async (req, res) => {
    try {
        const {id} = req.body;
        if(!id) res.status(400).json({"msg":"Please provide the id of the dish!"})
        await Extras.findByIdAndDelete(id)
        res.status(200).json({"message":"Succesfully deleted"})             // Succesfull Completion
    } catch (error) {
        res.status(500).json({"message":"Internal Server error"})           // Internal Server error
    }
}


// Get All Extras
const getAllExtras = async (req, res) => {
    try {
        const allExtras = await Extras.find()
        res.status(200).json(allExtras)
    } catch (error) {
        res.status(500).json({"message":"Internal Server error"})           // Internal Server error
    }
}

module.exports = { createExtra, editExtra, deleteExtra, getAllExtras }