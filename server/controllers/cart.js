const Cart = require("../model/Cart")

// Add Item to Cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, count, price, name, picturePath, basePrice, itemType, quantity,minquantity } = req.body
        // Check if the user already has a cart
        let cart = await Cart.findOne({ userId })
        if (!cart) {
            // If the user doesn't have a cart, create a new cart
            cart = new Cart({
                userId,
                items: [{ itemId, count, price, name, picturePath, basePrice, itemType, quantity,minquantity }]
            })
        } else {
            // If the user has a cart, add the item to the existing cart
            const existingItem = cart.items.find(item => item.itemId === itemId)

            if (existingItem) {
                // If the item already exists in the cart, increase its itemCount
                existingItem.count += count
                existingItem.price += (count * existingItem.basePrice)
            } else {
                // If the item doesn't exist in the cart, add it to the cart
                cart.items.push({ itemId, count, price, name, picturePath, basePrice, itemType, quantity,minquantity });
            }
        }
        console.log(cart);
        // Save the updated cart to the database
        const savedCart = await cart.save()
        res.status(200).json({ message: 'success', cart })
    }
    catch (err) {
        res.status(500).json({ message: `Internal server error ${err}` })
    }

}


// Change to count of Item
const changeCount = async (req, res) => {
    try {
        const { count, userId, itemId, price } = req.body
        const cart = await Cart.findOne({ userId })
        const item = cart.items.find(item => item.itemId === itemId)
        item.count = count
        item.price = price
        await cart.save()
        res.status(200).json({ message: `New Count is ${item.count}` })
    }
    catch (err) {
        res.status(500).json({ error: `Internal server error ${err}` })
    }

}


// Delete the Item
const deleteItem = async (req, res) => {
    try {
        const { itemId, userId } = req.body
        const cart = await Cart.findOne({ userId })
        const itemIndex = cart.items.findIndex(item => item.itemId === itemId)
        const resu = cart.items.splice(itemIndex, 1)
        await cart.save()
        res.status(200).json({ message: `Item deleted !`, "cart": cart })
    } catch (error) {
        res.status(500).json({ error: `Internal server error ${error}` })
    }
}

// Emmpty cart
const emptyCart = async (req, res) => {
    console.log("Empty req");
    try {
        const {userId} = req.params
        console.log(userId);
        const cart = await Cart.findOneAndUpdate({ userId }, { items: [] })// Set the items array to an empty array
        console.log(cart);
        res.status(201).json(cart)

    } catch (error) {
        res.status(500).json({ error: `Internal server error ${error}` })
    }
}

// Get a cart
const getCart = async (req, res) => {
    try {
        const { userId } = req.params
        const cart = await Cart.findOne({ userId })
        if (cart) {
            res.status(200).json(cart)
        }
        else {
            res.status(200).json({ "msg": "Cart is Empty" })
        }
    } catch (error) {
        res.status(500).json({ error: `Internal server error ${error}` })
    }
}

module.exports = { addToCart, changeCount, deleteItem, getCart, emptyCart }