const express = require('express')
const router = express.Router()
const { register, sendOtp, editUser, login } = require('../controllers/auth')
const { handleLogout } = require('../controllers/logout')


router.post('/sendOtp', sendOtp)
router.post('/register', register)
router.post('/login', login)
router.get('/logout',handleLogout)


module.exports = router