const express = require('express')
const router = express.Router()
const { createMenuItem, deleteMenuItem, editMenuItem,  getMenuItem } = require('../controllers/menuController')

router.post('/addMenuItem', createMenuItem)
router.delete('/deleteMenuItem', deleteMenuItem)
router.post('/editMenuItem', editMenuItem)
router.get('/getMenuItem', getMenuItem)

module.exports = router