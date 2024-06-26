import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function OrderSummary({ setsubtotal, goToNextStep }) {
    // State variables 
    const [coupon, setCoupon] = useState(''); // Input field value
    const [couponStatus, setCouponStatus] = useState(null); // Coupon status: 'applied', 'wrong'
    const [appliedCoupon, setAppliedCoupon] = useState(null); // Applied coupon value
    const [couponname, setCouponName] = useState(null)

    // All coupons
    const coupons = ['NEW30', 'FAST20', 'FUN15']
    // Retrieve cart state from Redux store
    const cart = useSelector(state => state.cart);
    // Calculate total number of items in the cart
    const itemCount = cart?.items?.length;
    // Calculate total price of items in the cart
    const totalPrice = cart?.items?.reduce((sum, cartItem) => sum + cartItem.price, 0);
    const [subTotal, setsubTotal] = useState(totalPrice)

    const [discount, setDiscount] = useState(0)

    // Function to handle applying a coupon
    const handleApplyCoupon = () => {
        // Check if the coupon is not empty
        const enteredCoupon = coupon.trim().toUpperCase()
        if (enteredCoupon.trim() !== '') {
            // Set coupon status to 'applied', store applied coupon, and clear input field
            const isValid = coupons?.includes(enteredCoupon)
            if (isValid) {
                setCouponStatus('applied')
                setCouponName(enteredCoupon)
                const saving = totalPrice * (parseInt(enteredCoupon.substring(enteredCoupon.length - 2))) / 100
                setDiscount(saving)
                const discountedprice = totalPrice - saving
                setsubTotal(discountedprice)
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
        setCoupon('');
        setCouponName(null)
        const saving = 0
        setDiscount(saving)
        const discountedprice = totalPrice - saving
        setsubTotal(discountedprice)
        setCouponStatus(null);
        setAppliedCoupon(null);
    }

    useEffect(() => {
        if (couponStatus === 'applied') {
            const discountPercent = couponname ? parseInt(couponname.substring(couponname.length - 2)) : ''
            const saving = totalPrice * discountPercent / 100
            setDiscount(saving)
            const discountedprice = totalPrice - saving;
            setsubTotal(discountedprice);
        }
        else {
            setsubTotal(totalPrice)
        }                               // eslint-disable-next-line
    }, [totalPrice])
    return (
        <div className='w-[80%]'>
            <div className="max-w-md mx-auto sm:p-4 md:p-10 bg-gray-100 rounded-md shadow-lg">
                <h1 className='text-2xl font-semibold'>Order Summary</h1>
                <h2 className='text-xl mt-4'>Total Items: {itemCount}</h2>
                <h2 className='text-xl mt-4'>Total: &#x20b9; {totalPrice}</h2>
                <div className="mt-4">
                    {/* Input field for entering coupon */}
                    <input type="text"
                        className="border-b border-gray-500 focus:outline-none uppercase w-[6rem]"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                    />
                    <div className="absolute bottom-0 left-0 w-full h-[0.5] bg-gray-500"></div>
                    {/* Apply button */}
                    <button
                        className={`rounded-lg px-2 py-1 ml-8
                         ${couponStatus === 'applied' ? 'bg-green-500 text-white pointer-events-none' : 'bg-red-500 text-white pointer-events-auto'}`}
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
                        <div className="mt-1 flex absolute left-0">
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
                {discount !== 0 && <h2 className='text-xl mt-4'>Savings: &#x20b9; {discount}</h2>}
                <h2 className='text-2xl mt-8'>Sub Total: &#x20b9; {subTotal}</h2>
                <div className='flex justify-end'>
                    <button onClick={() => { setsubtotal(subTotal); return goToNextStep() }} className="bg-red-600 text-white px-6 py-2 rounded-md mt-16 ">Next</button>
                </div>
            </div>
        </div>
    )
}

export default OrderSummary
