import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

function Address({ subtotal,setOrderDetails, goToNextStep, goToPreviousStep }) {
    // Fetching User from Store
    const user = useSelector(state => state.user)
    const cart = useSelector(state => state.cart)

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [address, setAddress] = useState(user.address);
    const [date, setdate] = useState('');
    const [time, setTime] = useState('');
    const [pin, setPin] = useState(user.pin);
    const [mobile, setMobile] = useState(user.phone)
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here, such as sending data to backend or performing validation
        const details = { userEmail:email, phone: mobile, address, pincode: pin, time, date, paid: false, items: cart?.items, transactionMode: "offline", userId: user._id, name, totalPrice: subtotal }
        setOrderDetails(details)
        goToNextStep();
    }
    return (
        <div className='sm:w-[80%]'>
            <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-md shadow-lg">
                <div className="flex">
                    <span className='pt-1 hover:cursor-pointer' style={{ height: 'fit-content' }} onClick={goToPreviousStep}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </span>
                    <h2 className="text-2xl font-semibold mb-4 ml-4">Delivery Details</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
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
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                            type="date"
                            id="date"
                            className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
                            value={date}
                            onChange={(e) => setdate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                        <input
                            type="time"
                            id="time"
                            className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Delivery Address</label>
                        <textarea
                            id="address"
                            className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
                            rows="4"
                            placeholder="Enter your delivery address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="pin" className="block text-sm font-medium text-gray-700">Pin Code</label>
                        <input
                            id="pin"
                            className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
                            type='number'
                            placeholder="Pincode"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            min='100000'
                            max='999999'
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
                    >
                        Place Order
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Address
