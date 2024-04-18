import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'

function Payment({ goToPreviousStep }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cvv, setCvv] = useState('');

  const handleExpiryDateChange = (e) => {
    const input = e.target.value;
    // Only allow MM/YY format
    if (/^\d{0,2}\/?\d{0,2}$/.test(input)) {
      setExpiryDate(input);
    }
  };
  const handlePayment = (e) => {
    e.preventDefault();
    // Handle payment logic here
  };
  return (
    <div>
      <div className="max-w-md mx-auto ">
        <div className="flex">
          <span className='pt-1 hover:cursor-pointer' style={{ height: 'fit-content' }} onClick={goToPreviousStep}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </span>
          <h2 className="text-2xl font-semibold mb-6 ml-4">Payment Details</h2>
        </div>

        <form onSubmit={handlePayment}>
          <div className="mb-4">
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-red-500"
              placeholder="Enter card number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              min='1000000000000000'
              max='9999999999999999'
              required
            />
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="text"
                id="expiryDate"
                className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-red-500"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                required
              />
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
              <input
                type="text"
                id="cvv"
                className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-red-500"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                min='100'
                max='999'
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700">Card Holder Name</label>
            <input
              type="text"
              id="cardHolder"
              className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-red-500"
              placeholder="Enter card Holder name"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              min='1000000000000000'
              max='9999999999999999'
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-500 "
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  )
}

export default Payment
