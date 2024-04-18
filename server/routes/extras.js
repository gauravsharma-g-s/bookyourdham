const express = require('express')
const router = express.Router()
const {createExtra,deleteExtra,editExtra} = require('../controllers/extras')

router.post('/addExtra',createExtra)
router.delete('/deleteExtra',deleteExtra)
router.post('/editExtra',editExtra)

module.exports = router