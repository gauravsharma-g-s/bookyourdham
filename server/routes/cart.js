const express  = require('express')
const { addToCart, changeCount,deleteItem,getCart,emptyCart } = require('../controllers/cart')
const router  = express.Router()

router.post('/addToCart',addToCart)
router.post('/changeCount',changeCount)
router.delete('/deleteItem',deleteItem)
router.get('/getCart/:userId',getCart)
router.delete('/emptycart/:userId',emptyCart)

module.exports = router