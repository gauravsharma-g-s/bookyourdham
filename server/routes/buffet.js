const express = require('express')
const router = express.Router()
const {createBuffet,deleteBuffet,editBuffet} = require('../controllers/buffetController')

router.post('/addBuffet',createBuffet)
router.delete('/deleteBuffet',deleteBuffet)
router.post('/editBuffet',editBuffet)

module.exports = router