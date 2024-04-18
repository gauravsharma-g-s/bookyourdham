import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setLogUser } from 'state'
import { isAccessTokenExpired } from 'util/index';
function Profile({ displayToast = () => { } }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [mobile, setMobile] = useState('');
    const [district, setDistrict] = useState('');
    const [pin, setPin] = useState('');
    const [state, setState] = useState('');
    const [imageUrl, setImageUrl] = useState(null)
    const baseUrl = process.env.REACT_APP_SERVER_URL
    const cloudbaseurl = process.env.REACT_APP_CLOUDINARY
    const dispatch = useDispatch()
    const fileInputRef = useRef(null)

    // Accessingbfrom the store
    const user = useSelector(state => state.user)
    const accessToken = useSelector(state => state.token)

    // Handle image file  select 
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            setImageUrl(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    // Handling the Submit button of Edit User
    const handleSubmit = async (e) => {
        e.preventDefault()
        const formdata = new FormData(e.target)
        formdata.append("email", user?.email)

        try {
            if (isAccessTokenExpired(accessToken)) {
                await fetch(`${baseUrl}/refresh`, {
                    method: 'GET',
                    credentials: 'include', // Include cookies in the request
                })
                

            }
            const editResp = await fetch(`${baseUrl}/editUser`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${accessToken}` },
                body: formdata
            })
            const editResponse = await editResp.json()
            displayToast("Details Saved", 1)
            dispatch(setLogUser({
                user: editResponse
            }))
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        if (user) {
            setName(user.name)
            setAddress(user.address)
            setDistrict(user.district)
            setEmail(user.email)
            setMobile(user.phone)
            setPin(user.pin)
            setState(user.state)
            const url = `${cloudbaseurl}/${user.picturePath}`
            setImageUrl(url)
        }                                                            // eslint-disable-next-line
    }, [user])

    return (
        <div>
            <form onSubmit={handleSubmit} className='mt-8'>
                <div className='flex flex-col sm:flex-row gap-16 justify-center items-center sm:items-start'>
                    <div>
                        <div className='bg-red-500 w-[8rem] h-[10rem] rounded-lg'>{imageUrl && <img src={imageUrl} className='w-[8rem] h-[10rem]' alt='' />}
                        </div>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                        />
                        <div className='userButton mt-4' onClick={() => fileInputRef.current.click()}
                            style={{ cursor: 'pointer' }}>Upload Image</div>
                    </div>
                    <div>

                        <div className="max-w-sm mx-auto p-4 bg-gray-100 rounded-md shadow-lg xxs:w-[40rem]">
                            <div className="flex">
                                <h2 className="text-2xl font-semibold mb-4 ml-4 text-black">Your Profile</h2>
                            </div>
                            <div>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name='name'
                                        className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile</label>
                                    <input type="tel" id="mobile" name="phone"
                                        className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
                                        pattern="^(\+91)?\d{10}$" maxlength="13" placeholder="+91XXXXXXXXXX" required value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}></input>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Delivery Address</label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
                                        rows="4"
                                        placeholder="Enter your Village, Post Office and Tehsil"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="district" className="block text-sm font-medium text-gray-700">District</label>
                                    <input
                                        id="district"
                                        name="district"
                                        className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
                                        type='text'
                                        placeholder="Enter your district"
                                        value={district}
                                        onChange={(e) => setDistrict(e.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                                    <input
                                        id="state"
                                        name='state'
                                        className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
                                        type='text'
                                        placeholder="Enter your state"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="pin" className="block text-sm font-medium text-gray-700">Pin Code</label>
                                    <input
                                        id="pin"
                                        name='pin'
                                        className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
                                        type='number'
                                        placeholder="Pincode"
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        min='100000'
                                        max='999999'
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Profile
