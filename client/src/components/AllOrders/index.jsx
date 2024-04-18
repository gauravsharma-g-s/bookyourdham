import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const token = useSelector(state => state.token)
    
    // backend Urls
    const url = process.env.REACT_APP_SERVER_URL;
    const cloudinaryUrl = process.env.REACT_APP_CLOUDINARY

    // Fetch all orders
    const fetchOrders = async () => {
        try {
            const response = await fetch(`${url}/order/allorders`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                console.error('Failed to fetch orders:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    // Function to mark order as paid
    const markPaid = async (orderId) => {
        const response = await fetch(`${url}/order/changestatus`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ paid: true, orderId })
        })
        if (response.ok)
            fetchOrders()
    };

    // Function to mark order as delivered
    const markDelivered = async (orderId) => {
        const response = await fetch(`${url}/order/changestatus`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ delivered: true, orderId })
        })
        if (response.ok)
            fetchOrders()
    };

    // Function to toggle expanded order
    const toggleOrder = (index) => {
        setExpandedOrder(expandedOrder === index ? null : index);
    };

    // Fetch orders on component mount
    useEffect(() => {
        fetchOrders();          // eslint-disable-next-line
    }, []);

    return (
        <div className="px-4 py-8 mx-8">
            <h1 className="text-2xl font-semibold mb-6">All Orders</h1>
            {orders?.map((order, index) => (
                <div key={order._id} className="bg-white rounded-lg shadow-md mb-6">
                    {/* Gray bar */}
                    <div className="bg-red-300 py-2 px-4 mb-4 flex justify-between items-center rounded-t-lg">
                        <div>
                            <div className="">Order ID:</div> <div className='text-sm'>{order._id}</div>
                        </div>
                        <div className='flex gap-2'>
                            {/* Buttons for marking paid and delivered */}
                            <div className='hidden sm:block'>
                                <button onClick={() => markPaid(order._id)} className={`px-4 py-1 text-white rounded-md mr-2 ${order.paid ? 'bg-blue-400' : 'bg-blue-500'}`} disabled={order.paid}>{order.paid ? 'Paid' : 'Mark Paid'}</button>
                                <button onClick={() => markDelivered(order._id)} className={`px-4 py-1 bg-green-500 text-white rounded-md  ${order.delivered ? 'bg-green-400' : 'bg-green-500'}`} disabled={order.delivered}>{order.delivered ? 'Delivered' : 'Mark Delivered'}</button>
                            </div>
                            {/* Button for toggling order details */}
                            <button onClick={() => toggleOrder(index)} className="px-4 py-1 bg-gray-300 text-gray-800 rounded-md"><FontAwesomeIcon icon={faChevronDown} /></button>
                        </div>
                    </div>
                    {/* Expanded order details */}
                    {expandedOrder === index && (
                        <div className='flex justify-between sm:hidden'>
                            <button onClick={() => markPaid(order._id)} className={`px-4 py-1 bg-blue-500 text-white rounded-md mr-2 ${order.paid ? 'bg-blue-400' : 'bg-blue-500'}`} disabled={order.paid}>{order.paid ? 'Paid' : 'Mark Paid'}</button>
                            <button onClick={() => markDelivered(order._id)} className={`px-4 py-1 bg-green-500 text-white rounded-md ${order.delivered ? 'bg-green-400' : 'bg-green-500'}`} disabled={order.delivered}>{order.delivered ? 'Delivered' : 'Mark Delivered'}</button>
                        </div>
                    )}
                    {/* Full order details */}
                    {expandedOrder === index && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 mt-4 pl-4">Order Details</h2>
                            <div>
                                <div className='pl-4'>
                                    {/* Order details */}
                                    <div><span className="font-semibold">Name: </span> {order.name}</div>
                                    <div><span className="font-semibold">Order Date:</span> {order?.createdAt?.substring(0, 10).split('-').reverse().join('/')}</div>
                                    <div><span className="font-semibold">Address: </span> {order.address}</div>
                                    <div><span className="font-semibold">Total Rs: </span> {order.totalPrice}</div>
                                    <div><span className="font-semibold">Pincode: </span> {order.pincode}</div>
                                    <div><span className="font-semibold">Email: </span> {order.userEmail}</div>
                                    <div><span className="font-semibold">Mobile Number: </span> {order.phone}</div>
                                    <div><span className="font-semibold">Delivery Date:</span> {order.date}</div>
                                    <div><span className="font-semibold">Delivery Time:</span> {order.time}</div>
                                    <div><span className="font-semibold">Status: </span> {!order.delivered ? 'On the Way' : 'Delivered'}</div>
                                    <div><span className="font-semibold">Payment: </span>{order.paid ? 'Paid' : 'Pending'}</div>
                                </div>

                                {/* Display items and their counts */}
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold mb-2 pl-4">Items</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="bg-white rounded-md shadow-md p-4 flex items-center space-x-4">
                                                <img src={`${cloudinaryUrl}/${item.picturePath}`} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                                <div>
                                                    <div className="font-semibold">{item.name}</div>
                                                    <div>Count: {item.count}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AllOrders;
