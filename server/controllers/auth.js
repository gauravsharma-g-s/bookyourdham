const User = require('../model/User');
const UserOtpVerification = require('../model/UserOtpVerification')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const cloudinary = require('cloudinary')
const jwt = require('jsonwebtoken')

/*  Configuring env file */
require('dotenv').config()

/*  NODEMAILER */
let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    }
})

/* CONFIGURING THE CLOUDINARY FOR IMAGE UPLOAD */
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Uploading image to Cloudinary
async function handleUpload(file) {
    const res = await cloudinary.v2.uploader.upload(file, {
        folder: "users",
        resource_type: "auto",
    });
    return res;
}

// Deleting image from the cloudinary
async function handleDelete(picturePath) {
    const res = await cloudinary.uploader.destroy(picturePath)
}

/*  Register User   */
const register = async (req, res) => {
    let isAuthenticated = false;
    try {
        const { otpId, otp } = req.body
        // Verify The Otp
        if (!otpId || !otp) {
            throw new Error('Empty OTP details not allowed!')
        }
        else {
            const UserOtpDetails = await UserOtpVerification.findById(otpId)
            if (UserOtpDetails.length <= 0) {
                // Record doesnt exists
                throw new Error('Otp doesnt Exists')
            }
            else {
                const { expiredAt } = UserOtpDetails
                const encryptedOtp = UserOtpDetails.otp
                // Check if otp expired
                if (expiredAt < Date.now()) {
                    await UserOtpVerification.deleteMany({ _id: otpId });
                    throw new Error("OTP expired. Plaese request again")
                }
                else {
                    // Check if Otp is correct or not
                    const validOtp = await bcrypt.compare(otp, encryptedOtp)

                    if (!validOtp) {
                        // Supply OTP is wrong
                        throw new Error("401 Invalid OTP")
                    }
                    else {
                        await UserOtpVerification.deleteMany({ _id: otpId });
                        isAuthenticated = true;
                    }
                }
            }
        }
        // Successful User Authentication
        if (isAuthenticated) {
            const { name, email, password } = req.body
            const salt = await bcrypt.genSalt()
            const encryptedpassword = await bcrypt.hash(password, salt)      // Password Encryption

            const newUser = new User({
                name,
                email,
                password: encryptedpassword
            })

            const savedUser = await newUser.save()
            const successfullySavedUser = { ...savedUser._doc, error: "No error" }
            res.status(201).json(successfullySavedUser);            // User saved successfully and returned saved User to Front-End
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}


/*  SENDING OTP */

const sendOtp = async (req, res) => {
    try {
        const { username:name, email, password } = req.body
        console.log(name,email,password)
        const hasAccount = await User.find({ email })
        if (hasAccount.length >= 1) {
            throw new Error('409 Another user with this email already exists!')
        }
        // Create Otp
        const otp = `${Math.floor(Math.random() * 900000) + 100000}`

        const salt = 10;
        const hashedOtp = await bcrypt.hash(otp, salt)
        const newOtp = new UserOtpVerification({
            email: email,
            otp: hashedOtp,
            createdAt: Date.now(),
            expiredAt: Date.now() + 3600000
        })

        // Save the Otp
        const savedOtp = await newOtp.save()
        const otpId = savedOtp._id

        // Email to send
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Welcome to bookyourdham: Verify Your Email",
            html: `
        <div style="background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif;">
            <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
                <h1 style="color: #ef4444; text-align: center;">Welcome to BOOKYOURDHAM</h1>
                <p style="color: #555; text-align: center;">Please verify your email address to get started.</p>
                <p style="color: #ef4444; text-align: center; font-size: 24px;"><b>${otp}</b></p>
                <p style="color: #555; text-align: center;">Enter this code to complete the Sign-Up Process.</p>
                <p style="color: #555; text-align: center;">This code expires in <b>1 hour</b>.</p>
            </div>
        </div>
    `,
        };

        // send the Otp
        await transporter.sendMail(mailOptions)

        // Sending response to user
        res.json({
            status: "PENDING",
            message: "Otp Sent",
            data: {
                name,
                email,
                otpId,
                password
            }
        })
    }
    catch (error) {
        res.json({
            status: "FAILED",
            message: error.message
        })
    }
}


/* EDIT USER DETAILS */

const editUser = async (req, res) => {
    try{
        const { name, phone, address, district, state, pin, email} = req.body
        const phonenum = parseInt(phone)
        const pinnum = parseInt(pin)
        let response = null
        // image storing
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64")
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64
            response = await handleUpload(dataURI)
        }
        let foundUser = await User.find({ email })
        let picturePath = foundUser.picturePath
        if (response && response.public_id) {
            if (picturePath && picturePath !== "")
                handleDelete(picturePath)
            picturePath = response.public_id
        }
        const updatedUser = await User.findOneAndUpdate({ email: email }, { name, phone: phonenum, address, district, state, pin: pinnum, picturePath } , { new: true }
        )
        const newUser = await User.find({email:email})
        res.json( updatedUser )
    }
    catch(err){
      //  console.log(err)
        res.status(500).json({err:err})
    }
    

}


/*  USER LOGIN */

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) return res.status(400).json({ "msg": "Email and password are required!" })

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ msg: "User doesn't exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ msg: "Please check your password!" })
        }
        else {
            // Create JWT
            const accessToken = jwt.sign(                  // Giving access and Refresh Token when someone Login
                {
                    id: user._id
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: Date.now()+86400000 }
            );

            const refreshToken = jwt.sign(
                {
                    id: user._id
                },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: Date.now()+172800000 }
            )

            const newUser = await User.findOneAndUpdate({ email: email }, { refreshToken: refreshToken }, { new: true })
            
            res.cookie('bookyourdhamToken', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });   // jwt is name of Cookie   // secure: true  - only in https
            res.json({ accessToken, user })

        }


    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
}


module.exports = { register, sendOtp, editUser, login }