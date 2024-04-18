const express = require('express')
const { makeOrder, getMyOrders, allOrders, changeStatus } = require('../controllers/orderController')

const router = express.Router()
router.post('/makeorder', makeOrder)
router.get('/getmyorders/:userId', getMyOrders)
router.get('/allorders', allOrders)
router.post('/changestatus', changeStatus)

module.exports = router