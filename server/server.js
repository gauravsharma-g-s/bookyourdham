const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const dotenv = require('dotenv')
const http = require('http')
const bodyParser = require('body-parser')
const multer = require('multer')
const cookieParser = require('cookie-parser')

const corsOption = require('./config/corsOptions')
const { editUser } = require('./controllers/auth')
const verifyJWT = require('./middleware/verifyJWT')
const { logger } = require('./middleware/logEvents')
const { getAllMenuItems } = require('./controllers/menuController')
const { getAllExtras } = require('./controllers/extras')
const { getAllBuffets } = require('./controllers/buffetController')

/* CONFIGURATIONS */
dotenv.config()
const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 6001

/* Middleware Setup */
app.use(logger)
app.use(cors(corsOption))
app.use(express.json())
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cookieParser())

/* multer middleware */
const storage = new multer.memoryStorage()
const upload = multer({
    storage,
});

/* All Routes  */
app.use('/auth', require('./routes/auth'))                                  // Login Register SendOtp Logout
app.use('/refresh', require('./routes/refresh'))
app.get('/menu/getAllMenuItems', getAllMenuItems)
app.get('/extra/getAllExtras', getAllExtras)
app.get('/buffet/getAllBuffets', getAllBuffets)

app.use(verifyJWT)
app.post('/editUser', upload.single("image"), editUser)
app.use('/menu', upload.single("image"), require('./routes/menu'))
app.use('/extra', upload.single("image"), require('./routes/extras'))
app.use('/buffet', upload.single("image"), require('./routes/buffet'))
app.use('/cart', require('./routes/cart'))
app.use('/order', require('./routes/order'))

/* Mongoose Setup  */
mongoose.connect(process.env.MONGO_URL).then(() => {
    server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
}).catch(err => console.log(`${err} ! Cannot connect to server`))