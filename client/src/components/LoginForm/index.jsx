import React, { useState,  CSSProperties } from 'react';
import './index.css';
import { faLock, faX, faEnvelope, faChild } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OtpComponent from 'components/OtpComponent';
import { RingLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setLogin, setLogUser } from 'state';

function LoginForm({ setShowForm }) {
    const [registerForm, setRegisterForm] = useState(false);
    const [forgot, setForgot] = useState(false);
    const [isOTP, setOTP] = useState(false)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const baseUrl = process.env.REACT_APP_SERVER_URL

    const dispatch = useDispatch();

    //Sending the OTP
    const sendOtp = async (data) => {
        setLoading(true)
        const otpResponse = await fetch(`${baseUrl}/auth/sendOtp`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        const jsonResponse = await otpResponse.json()
        if (jsonResponse.message.split(" ")[0] === '409') {
            displayToast("Email already registered ☹️", 3)
            setLoading(false)
        }
        else {
            setUser({
                name: jsonResponse.data.name,
                email: jsonResponse.data.email,
                otpId: jsonResponse.data.otpId,
                password: jsonResponse.data.password
            })
            setRegisterForm(false)
            setOTP(true)
            setLoading(false)
            displayToast("OTP sent successfully", 1)
        }
    }

    // Register after Otp entering
    const registerUser = async (otp) => {
        setLoading(true)
        try {
            const data = { ...user, otp }
            const registerRes = await fetch(`${baseUrl}/auth/register`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            const jsonResponse = await registerRes.json()
            console.log(jsonResponse);
            if (jsonResponse.error === '401 Invalid OTP') {
                setLoading(false)
                displayToast("Check your OTP", 2)
            }
            else {
                setOTP(false)
                setLoading(false)
                setShowForm(false)
                displayToast("Registered! Please Login Now", 1)
            }

        }
        catch (err) {
            displayToast("Internal Server Error", 3)
            setLoading(false)
        }
    }

    // Login User
    const handleLogin = async (data) => {
        setLoading(true)
        try {
            const loginRes = await fetch(`${baseUrl}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            const loginResponse = await loginRes.json()
            if (loginRes.status === 400) {
                displayToast("Email and password doesn't match!", 2)
                setLoading(false)
            }
            else {
                dispatch(setLogin({
                    token: loginResponse.accessToken
                }))
                dispatch(setLogUser({
                    user: loginResponse.user
                }))
                setShowForm(false)
                setLoading(false)
            }

        } catch (error) {
            displayToast(`Internal Server Error`, 3)
            setLoading(false)
        }
    }

    // Handle the submission of Form
    const handleFormSubmit = async (event) => {
        event.preventDefault()

        // Collect Form Data
        const formData = new FormData(event.target)
        const data = {}
        formData.forEach((value, key) => {
            data[key] = value
        })
        data["otpId"] = user?.otpId
        if (!isOTP) {
            if (registerForm) await sendOtp(data)
            else if (!registerForm) await handleLogin(data)
        }
    }

    // Otp Submit
    const onOtpSubmit = async (otp) => {
        await registerUser(otp)
    }

    // Loader properties overriding     
    const override: CSSProperties = {
        left: '150px'
    }

    // Toast Settings  Displaying Toast
    const displayToast = (text, status) => {
        if (status === 1) toast.success(text)
        else if (status === 2) toast.error(text)
        else if (status === 3) toast.warn(text)
        else if (status === 4) toast.info(text)
    }

    return (
        <div className='outer-box'>
            <ToastContainer />
            <div className='login-box'>
                <RingLoader color='red' loading={loading} cssOverride={override} />
                <form onSubmit={handleFormSubmit}>
                    {!isOTP &&
                        <div>
                            <div className='flex justify-between'>
                                <h2>{registerForm ? 'Sign Up' : forgot ? 'Reset Password' : 'Login'}</h2>
                                <button className='cancel' onClick={() => setShowForm(false)}><FontAwesomeIcon icon={faX} /></button>
                            </div>

                            {registerForm && (<div className="input-box">
                                <span className="icon"><FontAwesomeIcon icon={faChild} /></span>
                                <input type='text' className='loginInput' name='username' required style={{ background: 'transparent' }} />
                                <label>Name</label>
                            </div>)}

                            <div className="input-box">
                                <span className="icon"><FontAwesomeIcon icon={faEnvelope} /></span>
                                <input type='email' className='loginInput' name='email' required />
                                <label>Email</label>
                            </div>

                            <div className="input-box">
                                <span className="icon"><FontAwesomeIcon icon={faLock} /></span>
                                <input type='password' className='loginInput' name='password' required />
                                <label>Password</label>
                            </div>
                            <div className="remember-forget">
                                <label><input type='checkbox' />Remember me</label>
                                {!forgot && !registerForm && <span onClick={() => setForgot(!forgot)}>Forgot Password?</span>}
                            </div>
                            <button className='submitbutton' type='submit'>{registerForm ? 'Register' : forgot ? 'Verify' : 'Login'}</button>
                            {(registerForm || !forgot) && <div className="registration-link">
                                <p>{registerForm ? 'Already have an account?  ' : `Don't have an account?  `}<span onClick={() => setRegisterForm(!registerForm)}>{registerForm ? 'Login' : 'Signup here'}</span></p>
                            </div>}
                        </div>
                    }

                    {
                        isOTP && <div>
                            <div className='flex justify-between'>
                                <h2>Otp Verification</h2>
                                <button className='cancel' onClick={() => setShowForm(false)}><FontAwesomeIcon icon={faX} /></button>
                            </div>
                            <OtpComponent length={6} onOtpSubmit={onOtpSubmit} />
                        </div>
                    }

                </form>
            </div>
        </div>

    )
}

export default LoginForm;
