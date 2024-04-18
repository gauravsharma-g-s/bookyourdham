import React, { useState } from 'react'
import Stepper from './Stepper';
import OrderSummary from 'components/OrderSummary';
import Address from 'components/Address';
import Payment from 'components/Payment';
import PaymentTabs from 'components/Payment/PaymentTab';

function Order({ setCartEmpty, orderDetails, setOrderDetails, currentStep, goToNextStep, goToPreviousStep, NUMBER_OF_STEPS }) {
  const [subtotal, setsubtotal] = useState(0)
  return (
    <div className='hidden sm:block w-[50%]'>
      <div className='w-[100%] flex mt-8 gap-8 sm:ml-[2.5rem] md:ml-[4rem]'>
        <div className='w-[1%] mt-8'>
          <Stepper currentStep={currentStep} numberOfSteps={NUMBER_OF_STEPS} />
        </div>
        {
          (currentStep === 0 && <OrderSummary subtotal={subtotal} setsubtotal={setsubtotal} goToNextStep={goToNextStep} />)
        }
        {
          (currentStep === 1 && <Address subtotal={subtotal} setOrderDetails={setOrderDetails} goToNextStep={goToNextStep} goToPreviousStep={goToPreviousStep} />)
        }
        {
          (currentStep === 2 && <PaymentTabs setCartEmpty={setCartEmpty} orderDetails={orderDetails} setOrderDetails={setOrderDetails} goToPreviousStep={goToPreviousStep} />)
        }
      </div>
    </div>

  )
}

export default Order
