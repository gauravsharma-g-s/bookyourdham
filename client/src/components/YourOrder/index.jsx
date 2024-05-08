import React, { useEffect, useState } from 'react';
import './index.css'

const YourOrder = () => {
  const url = process.env.REACT_APP_SERVER_URL
  const [orders, setOrders] = useState(null)
  const [openDetails, setOpenDetails] = useState(false)

  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')
  const cloudinaryUrl = process.env.REACT_APP_CLOUDINARY

  // Fetch all the orders
  const fetchOrders = async () => {
    const ordersRes = await fetch(`${url}/order/getmyorders/${user._id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
   
    const orderResponseJson = await ordersRes.json()
    if(ordersRes.ok)
    setOrders(orderResponseJson)

  }

  useEffect(() => {
    fetchOrders()     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // &#x20b9;
  return (
    <div >
      <div className="mx-8 px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">My Orders</h1>
        {orders?.map((order, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md  mb-6">
            <div className="bg-red-300 px-4 py-2 mb-4 rounded-t-lg">
              <div className="flex justify-between items-center text-sm text-gray-600 py-2">
                <div className='hidden xs:block'><div className='text-[0.7rem] uppercase'>Order Date </div><div>{order?.createdAt?.substring(0, 10).split('-').reverse().join('/')}</div></div>
                <div className='hidden sm:block'><div className='text-[0.7rem] uppercase'>Deliver To: </div><div>{order.name}</div></div>
                <div><div className='text-[0.7rem] uppercase'>Total: </div><div>&#x20b9; {order.totalPrice}</div></div>
                <div className='hidden md:block'><div className='text-[0.7rem] uppercase'>Order ID </div><div>{order._id}</div></div>
                <button className="px-4 py-1 bg-gray-300 text-gray-800 rounded-md" onClick={() => setOpenDetails(!openDetails)}>
                  View More
                </button>
              </div>
              {
                openDetails &&
                <div className='text-gray-800'>
                  <div className='flex gap-[2rem] justify-between pt-2'>
                    <div className='text-xs'>Address : {order.address} </div>
                    <div className='text-xs'>Delivery Date: {order.date.split('-').reverse().join('/')} {order.time}</div>
                  </div>
                  <div className='flex gap-[2rem] justify-between pt-2 sm:hidden'>
                    <div className='text-xs'>Deliver To : {order.name} </div>
                    <div className='text-xs'>Order Date: {order?.createdAt?.substring(0, 10).split('-').reverse().join('/')}</div>
                  </div>
                </div>
              }
            </div>
            <div className="grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {order?.items?.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="bg-white rounded-md shadow-md p-4 flex items-center space-x-4"
                >
                  <img
                    src={`${cloudinaryUrl}/${item?.picturePath}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div>Persons: {item.itemType === 'buffet' ? item.count * item.quantity : item.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};


export default YourOrder;
