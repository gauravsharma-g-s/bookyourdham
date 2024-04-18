import React, { useEffect, useRef, useState } from 'react'
import './index.css'

function OtpComponent({ length ,onOtpSubmit = () => {}}) {
    const [otp, setOtp] = useState(new Array(length).fill(""))
    const inputRefs = useRef([])

    // Taking the input from a otp field
    const handleChange = (i, e) => {
        const value = e.target.value
        if (isNaN(value)) return

        const newOtp = [...otp]
        // Allow only one input
        newOtp[i] = value.substring(value.length - 1)
        setOtp(newOtp)

        // Submit Trigger
        const combinedOtp = newOtp.join("")
        if(combinedOtp.length === length) onOtpSubmit(combinedOtp)
        // Move to next field if current is filled
        setTimeout(() => {
            if (value && i < (length - 1) && inputRefs.current[i + 1]) {
                inputRefs.current[i + 1].focus();
            }
        }, 0);
    }

    const handleClick = (i) => {
        inputRefs.current[i].setSelectionRange(1, 1)
        setTimeout(() => {
            if (i > 0 && !otp[i - 1]) {
                inputRefs.current[otp.indexOf("")].focus()
            }
        }, 0)
    }

    const handleKeyDown = (i, e) => {
        if (e.key === 'Backspace' && !otp[i] && i > 0 && inputRefs.current[i - 1]) {
            // Move focus to previous input field on backspace
            inputRefs.current[i - 1].focus()
        }
    }

    // Focus first box
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus()
        }
    })
    return (
        <div className=''>
            <div>
                <h1 className='otpHeading'>Enter the otp sent to your mail</h1>
            </div>
            <div>
                {
                    otp?.map((value, i) => {
                        return (
                            <input
                                key={i}
                                type='text'
                                ref={(input) => (inputRefs.current[i] = input)}
                                value={value}
                                onChange={(e) => handleChange(i, e)}
                                onClick={() => handleClick(i)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                className='otpInput' />
                        )
                    })
                }
            </div>
            <div>
                <button className='otpSubmit' type='submit' onClick={()=>{  const combinedOtp = otp.join("");onOtpSubmit(combinedOtp)}}>Verify</button>
            </div>

        </div>
    )
}

export default OtpComponent
