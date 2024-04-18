import React, { useState } from 'react';
import Payment from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { displayToast } from 'util';
import { emptyCart } from 'state';

function PaymentTabs({ setCartEmpty, orderDetails, goToPreviousStep }) {
    const [activeTab, setActiveTab] = useState('online')

    const url = process.env.REACT_APP_SERVER_URL
    const user = useSelector(state => state.user)
    const token = useSelector(state => state.token)

    const dispatch = useDispatch()

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    }

    // Place the order via Pay on Delivery
    const makeOrder = async () => {
        const orderResponse = await fetch(`${url}/order/makeorder`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderDetails)
        })
        
        if (orderResponse.status === 201)
            displayToast("Order Placed successfully🙏", 1)
        const editCartRes = await fetch(`${url}/cart/emptycart/${user._id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        if (editCartRes.ok) {
            setCartEmpty(0)
            dispatch(emptyCart())
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-md shadow-md relative ">
            <div className="flex">
                <div
                    className={`flex-1 text-center py-2 cursor-pointer ${activeTab === 'online' ? 'bg-red-500 text-white' : 'text-gray-600'}`}
                    onClick={() => handleTabChange('online')}
                >
                    Online Payment
                </div>
                <div
                    className={`flex-1 text-center py-2 cursor-pointer ${activeTab === 'cash' ? 'bg-red-500 text-white' : 'text-gray-600'}`}
                    onClick={() => handleTabChange('cash')}
                >
                    Cash on Delivery
                </div>
            </div>
            <div className="p-4">
                {activeTab === 'online' && <Payment goToPreviousStep={goToPreviousStep} />}
                {activeTab === 'cash' && (
                    <div className="text-center">
                        <div className="flex">
                            <span className='pt-1 hover:cursor-pointer' style={{ height: 'fit-content' }} onClick={goToPreviousStep}>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </span>
                            <h2 className="text-2xl font-semibold mb-6 ml-4">Pay on Delivery</h2>
                        </div>
                        <ul>
                            <li className='text-2xl mt-4 font-semibold'>Total amount to Pay &#x20b9; {orderDetails.totalPrice}</li>
                            <li className='text-[#959497] italic mt-8'>You can pay using either Cash or your favourite UPI application at your doorstep</li>
                        </ul>
                        <button
                            type="submit"
                            className=" bg-red-500 text-white py-2 mx-4 rounded-md
                             hover:bg-red-600 focus:outline-none focus:ring focus:border-red-500 px-6  md:absolute md:left-0 md:bottom-4 md:right-0"
                            onClick={makeOrder}
                        >
                            Place your Order
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PaymentTabs;
