const Buffet = require('../model/Buffet')
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
    const res = await cloudinary.uploader.upload(file,function(res){console.log("Image uploaded");}, {
        folder: "buffets",
        resource_type: "auto",
    });
    return res;
}

// Deleting image from the cloudinary
async function handleDelete(picturePath) {
    await cloudinary.uploader.destroy(picturePath)
}


// Creating a new Buffet
const createBuffet = async (req, res) => {
    try {
        const { name, price, quantity, buffetItems } = req.body
        const priceInt = parseInt(price)
        const quantityInt = parseInt(quantity)
        if (!name || !buffetItems || !price || !quantity) res.status(400).json({ "msg": "Please provide all details of buffet!" })
        const dishes = buffetItems.split(/,\s*/g)
        let response = null
        // image storing
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64")
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64
            response = await handleUpload(dataURI)
        }
        const picturePath = response?.public_id ? response.public_id : ""
        const newBuffet = new Buffet({ name, dishes, price: priceInt, quantity: quantityInt, picturePath })

        await newBuffet.save()
        const allBuffets = await Buffet.find()
        res.status(201).json(allBuffets)
    }
    catch (err) {
        res.status(409).json({ message: err.message })
    }
}


// Editing a Buffet

const editBuffet = async (req, res) => {
    try {
        const { id, dishes, price, quantity } = req.body
        const priceInt = parseInt(price)
        const quantityInt = parseInt(quantity)
        if (!id || !dishes || !price || !quantity) return res.status(400).json({ "msg": "Please provide all details of dish!" })

        let response = null
        // image storing
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64")
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64
            response = await handleUpload(dataURI)
        }

        let foundBuffet = await Buffet.findById(id)
        let picturePath = foundBuffet.picturePath
        if (response && response.public_id) {
            if (picturePath && picturePath !== "")
                handleDelete(picturePath)
            picturePath = response.public_id
        }
        const updatedBuffet = await Buffet.findByIdAndUpdate(id, { dishes, price: priceInt, quantity: quantityInt, picturePath }, { new: true })

        res.json(updatedBuffet)
    }
    catch (err) {
        res.status(409).json({ message: err.message })
    }
}

// Deleting Buffet
const deleteBuffet = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) res.status(400).json({ "msg": "Please provide the id of the Buffet!" })
        await Buffet.findByIdAndDelete(id)
        res.status(200).json({ "message": "Succesfully deleted" })             // Succesfull Completion
    } catch (error) {
        res.status(500).json({ "message": "Internal Server error" })           // Internal Server error
    }
}


// Get All Buffets
const getAllBuffets = async (req, res) => {
    try {
        const allBuffets = await Buffet.find()
        res.status(200).json(allBuffets)
    } catch (error) {
        res.status(500).json({ "message": "Internal Server error" })           // Internal Server error
    }
}

module.exports = { createBuffet, editBuffet, deleteBuffet, getAllBuffets }