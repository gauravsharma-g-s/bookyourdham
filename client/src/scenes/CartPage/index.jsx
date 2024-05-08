import Order from 'components/Order';
import CartItems from 'components/CartItems';
import React, { useEffect, useState } from 'react';
import MobileOrderSummary from 'components/OrderSummary/MobileOrderSummary';
import Address from 'components/Address';
import { useSelector, useDispatch } from 'react-redux';
import { setCart } from 'state';
import { useNavigate } from 'react-router-dom';
import PaymentTabs from 'components/Payment/PaymentTab';
import { ToastContainer } from 'react-toastify';

/*
  Main Cart page
*/
function CartPage() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [cartItems, setCartItems] = useState([])
  const [orderDetails, setOrderDetails] = useState(null)
  const [subtotal, setsubtotal] = useState(0)
  //let orderDetails = {}
  const NUMBER_OF_STEPS = 3
  // Fetching from store
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')
  const cart = useSelector(state => state.cart)

  const cartLength = cart != null ? cart.items.length : 0
  const [CartEmpty, setCartEmpty] = useState(cartLength)

  /*  Url for making api calls   */
  const baseUrl = process.env.REACT_APP_SERVER_URL
  const cloudinaryUrl = process.env.REACT_APP_CLOUDINARY

  /*  Clicking on next and back button in cart */
  const goToNextStep = () => setCurrentStep(prev => prev === NUMBER_OF_STEPS - 1 ? prev : prev + 1)
  const goToPreviousStep = () => setCurrentStep(prev => prev <= 0 ? prev : prev - 1)

  const navigate = useNavigate()

  // Fetch cart items from API
  const getMyCart = async () => {
    const cartRes = await fetch(`${baseUrl}/cart/getCart/${user._id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    const cartResJson = await cartRes.json()
    if (cartResJson.msg !== 'Cart is Empty') {
      dispatch(setCart({ cart: cartResJson }))
    }
    if (cartResJson.msg === 'Cart is Empty') {
      setCartEmpty(0)
    }
  }

  useEffect(() => {
    getMyCart()
    setCartItems(cart?.items)
    window.scrollTo(0,0)        // eslint-disable-next-line
  }, [cartItems])


  return (
    <div className='sm:mx-8 md:mx-16 lg:mx-24'>
      <ToastContainer />
      {
        CartEmpty !== 0 && <div>
          <div className='block sm:hidden '>
            {
              currentStep === 0 && <MobileOrderSummary subtotal={subtotal} setsubTotal={setsubtotal} setCurrentStep={setCurrentStep} />
            }
            {
              currentStep === 1 && <Address  subtotal={subtotal} orderDetails={orderDetails} setOrderDetails={setOrderDetails} goToNextStep={goToNextStep} goToPreviousStep={goToPreviousStep} />
            }
            {
              currentStep === 2 && <PaymentTabs setCartEmpty={setCartEmpty} orderDetails={orderDetails} goToNextStep={goToNextStep} goToPreviousStep={goToPreviousStep} />
            }
          </div>

          {currentStep === 0 && <div className='flex justify-center sm:hidden'>
            <CartItems currentStep={currentStep} setCartEmpty={setCartEmpty} cartItems={cartItems} setCartItems={setCartItems} />
          </div>}

          <div className='flex justify-center sm:justify-between'>
            <div className='hidden sm:block'>
              <CartItems currentStep={currentStep} setCartEmpty={setCartEmpty} cartItems={cartItems} setCartItems={setCartItems} />
            </div>

            <Order subtotal={subtotal} setsubtotal={setsubtotal} setCartEmpty={setCartEmpty} orderDetails={orderDetails} setOrderDetails={setOrderDetails} itemCount={cart?.items?.length} goToNextStep={goToNextStep} goToPreviousStep={goToPreviousStep} currentStep={currentStep} NUMBER_OF_STEPS={NUMBER_OF_STEPS} />
          </div>
        </div>
      }
      {
        CartEmpty === 0 && (
          <div className='mt-[2rem] flex flex-col justify-center items-center'>
            <p className='text-2xl font-semibold text-gray-600 mb-1'>Your cart is empty</p>
            <p className='text-md text-gray-600 mb-5'>Add some items to your cart to start ordering</p>
            <button className='bg-red-500 font-semibold text-white px-6 py-1' onClick={() => {
              navigate('/menu')
              navigate(0)
            }}>
              Go to Menu
            </button>
            <div>
              <img src={`${cloudinaryUrl}/users/empty_cart-removebg-preview_eqio8r`} alt='Empty cart' />
            </div>
          </div>
        )
      }


    </div>
  );
}

export default CartPage;
