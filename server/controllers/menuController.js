const MenuItem = require('../model/MenuItem')
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
        folder: "menuItems",
        resource_type: "auto",
    });
    return res;
}

// Deleting image from the cloudinary
async function handleDelete(picturePath) {
    await cloudinary.uploader.destroy(picturePath)
}

// Creating a new Menu Item
const createMenuItem = async (req, res) => {
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
        const newItem = new MenuItem({ name, price: priceInt, quantity: quantityInt, picturePath,basePrice })

        await newItem.save()
        const allDishes = await MenuItem.find()
        res.status(201).json(allDishes)
    }
    catch (err) {
        res.status(409).json({ message: err.message })
    }
}


// Editing a menuItem

const editMenuItem = async (req, res) => {
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

        let foundMenuItem = await MenuItem.find({ _id: id })
        let picturePath = foundMenuItem.picturePath
        if (response && response.public_id) {
            if (picturePath && picturePath !== "")
                handleDelete(picturePath)
            picturePath = response.public_id
        }
        const updatedItem = await MenuItem.findByIdAndUpdate(id, { name, price: priceInt, quantity: quantityInt, picturePath,basePrice }, { new: true })

        res.json(updatedItem)
    }
    catch (err) {
        res.status(409).json({ message: err.message })
    }
}

// Deleting MenuItem
const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) res.status(400).json({ "msg": "Please provide the id of the dish!" })
        await MenuItem.findByIdAndDelete(id)
        res.status(200).json({ "message": "Succesfully deleted" })             // Succesfull Completion
    } catch (error) {
        res.status(500).json({ "message": "Internal Server error" })           // Internal Server error
    }
}


// Get All MenuItems
const getAllMenuItems = async (req, res) => {
    try {
        const allmenuItems = await MenuItem.find()
        res.status(200).json(allmenuItems)
    } catch (error) {
        res.status(500).json({ "message": "Internal Server error" })           // Internal Server error
    }
}


// Get Menu Item
const getMenuItem = async (req, res) => {
    try {
        const {itemId} = req.params
        const menuItem = await MenuItem.findById(itemId)
        res.status(200).json(menuItem)
    } catch (error) {
        res.status(500).json({ "message": "Internal Server error" })           // Internal Server error
    }
}

module.exports = { createMenuItem, editMenuItem, deleteMenuItem, getAllMenuItems, getMenuItem }