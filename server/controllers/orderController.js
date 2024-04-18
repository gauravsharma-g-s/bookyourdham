const Order = require('../model/Order')

// make an new Order
const makeOrder = async (req, res) => {
    try {
        const { userEmail, phone, address, pincode, time, date, paid, items, transactionMode, userId,name,totalPrice } = req.body
        
        const newOrder = new Order({ userEmail: userEmail, phone, address, pincode, time, date, paid, items, transactionMode, userId,name,totalPrice })

        const savedOrder = await newOrder.save()
        console.log(savedOrder)
        res.status(201).json(savedOrder)
    } catch (error) {
        console.log(error)
        res.status(500).json({ 'msg': `Internal server error ${error}` })
    }
}

// Get all orders
const getMyOrders = async (req, res) => {
    try {
        const { userId } = req.params
        const myorders = await Order.find({ userId })
        res.status(201).json(myorders)
    } catch (error) {
        console.log(error)
        res.status(500).json({ 'msg': `Internal server error ${error}` })
    }
}


// Get a particular user orders
const allOrders = async (req, res) => {
    try {
        const orders = await Order.find()
        res.status(201).json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).json({ 'msg': `Internal server error ${error}` })
    }
}

// Change status of Order
const changeStatus = async (req, res) => {
    try {
        const { paid, delivered, orderId, cancelled } = req.body
        const order = await Order.findByIdAndUpdate(orderId, { paid, delivered, cancelled }, { new: true })
        await order.save()
        res.status(201).json(order)
    } catch (error) {
        console.log(error)
        res.status(500).json({ 'msg': `Internal server error ${error}` })
    }
}

module.exports = { makeOrder, getMyOrders, allOrders, changeStatus }