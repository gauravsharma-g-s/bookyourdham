import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function MobileOrderSummary({subtotal, setsubTotal, setCurrentStep }) {
    // State variables 
    const [coupon, setCoupon] = useState(''); // Input field value
    const [couponStatus, setCouponStatus] = useState(null); // Coupon status: 'applied', 'wrong'
    const [appliedCoupon, setAppliedCoupon] = useState(null); // Applied coupon value
    const [couponname,setCouponName] = useState(null)
    // All coupons
    const coupons = ['NEW30','FAST20','FUN15']
    // Proceed to address step
    const goToAddress = () => {
        return setCurrentStep(prev => prev + 1);
    }

    // Retrieve cart state from Redux store
    const cart = useSelector(state => state.cart)
    // Calculate total number of items in the cart
    const itemCount = cart?.items?.length
    // Calculate total price of items in the cart
    const totalPrice = cart?.items?.reduce((sum, cartItem) => sum + cartItem.price, 0)
    const [total,setTotal] = useState(totalPrice)
    const [discount, setDiscount] = useState(0)

    // Function to handle applying a coupon
    const handleApplyCoupon = () => {
        // Check if the coupon is not empty
        const enteredCoupon = coupon.trim().toUpperCase()
        if (enteredCoupon.trim() !== '') {
            // Set coupon status to 'applied', store applied coupon, and clear input field
            const isValid = coupons?.includes(enteredCoupon)
            if(isValid){
            setCouponStatus('applied')
            setCouponName(enteredCoupon)
            const saving = totalPrice * (parseInt(enteredCoupon.substring(enteredCoupon.length-2)))/100
            setDiscount(saving)
            const discountedprice = totalPrice - saving
            setTotal(discountedprice)
            setAppliedCoupon(coupon.trim())
            setCoupon('')
        }
        else {
            // Set coupon status to 'Invaid' if the coupon is Invalid
            setCouponStatus('Invalid')
        }
        } else {
            // Set coupon status to 'Empty' if the coupon is empty
            setCouponStatus('Empty')
        }
    }

    // Function to handle removing a coupon
    const handleRemoveCoupon = () => {
        // Reset coupon state and status
        setCoupon('')
        setCouponName(null)
        const saving = 0
        setDiscount(saving)
        const discountedprice = totalPrice - saving
        setTotal(discountedprice)
        setCouponStatus(null);
        setAppliedCoupon(null);
    }

    useEffect(() => {
        if (couponStatus === 'applied') {
            const discountPercent = couponname ? parseInt(couponname.substring(couponname.length - 2)) : ''
            const saving = totalPrice * discountPercent / 100
            setDiscount(saving)
            const discountedprice = totalPrice - saving;
            setTotal(discountedprice);
        }
        else {
            setTotal(totalPrice)
        }                               // eslint-disable-next-line
    }, [totalPrice])

    return (
        <div>
            <div className='flex flex-col items-center justify-center'>
                <h1 className='text-xl font-semibold'>Order Summary</h1>
                <h2>Total Items: {itemCount}</h2>
                <h2>Total &#x20b9; {totalPrice}</h2>
                <div className="relative mt-4">
                    {/* Input field for entering coupon */}
                    <input
                        type="text"
                        className="border-b border-gray-500 focus:outline-none uppercase w-[6rem] pr-8"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                    />
                    {/* Divider line */}
                    <div className="absolute bottom-0 left-0 w-full h-[0.5] bg-gray-500"></div>
                    {/* Apply button */}
                    <button
                        className={`rounded-lg px-4 py-1 ml-4 ${couponStatus === 'applied' ? 'bg-green-500 text-white pointer-events-none' : 'bg-red-500 text-white pointer-events-auto'}`}
                        onClick={handleApplyCoupon}
                    >
                        {couponStatus === 'applied' ? 'Applied' : 'Apply'}
                    </button>
                    {/* Display error message if coupon is invalid */}
                    {couponStatus === 'Invalid' && <p className="text-xs text-red-500">Coupon Invalid</p>}
                    {/* Display error message if coupon is invalid */}
                    {couponStatus === 'Empty' && <p className="text-xs text-red-500">Coupon Empty</p>}
                </div>
                {/* Display applied coupon and remove button if coupon is applied */}
                {couponStatus === 'applied' && (
                    <div className='relative'>
                        <div className="mt-1 flex absolute -left-24">
                            {/* Display applied coupon */}
                            <p className="bg-red-300 rounded px-1 py-0.5 uppercase text-[0.5rem]">
                                {appliedCoupon}
                            </p>
                            {/* Button to remove coupon */}
                            <button
                                className="text-gray-500 hover:text-red-500 focus:outline-none bg-gray-200 px-0.5 py-0.5 text-black text-[0.5rem] font-extrabold"
                                onClick={handleRemoveCoupon}
                            >
                                x
                            </button>
                        </div>
                    </div>

                )}

                {/* Subtotal and proceed to pay button */}
                {discount!==0 &&<h2 className='text-xl mt-4'>Savings: &#x20b9; {discount}</h2>}
                <h2 className='text-xl mt-6'>Sub Total &#x20b9; {total}</h2>
                <button
                    className='bg-red-500 text-white py-2 px-[4rem] rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-500 mt-8'
                    onClick={()=> {setsubTotal(total); return goToAddress()}}
                >
                    Proceed to Pay
                </button>
            </div>
        </div>
    );
}

export default MobileOrderSummary;
