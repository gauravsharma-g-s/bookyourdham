import React, { useState } from 'react'
import './index.css'
import Profile from 'components/Profile'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { displayToast } from 'util';
import UploadItem from 'components/UploadItem';
import YourOrder from 'components/YourOrder';
import { useSelector } from 'react-redux'
import AllOrders from 'components/AllOrders';


function ProfilePage() {
  const [isProfile, setIsProfile] = useState(true)
  const [isUpload, setIsUpload] = useState(false)
  const [isYourOrder, setIsYourOrder] = useState(false)
  const [isAllOrders, setIsAllOrders] = useState(false)
  const [activeTab,setActiveTab] = useState('profile')

  const isAdmin = useSelector(state => state.user.admin)

  // CLicking on Your Profile
  const handleProfile = () => {
    setIsProfile(true)
    setIsUpload(false)
    setIsYourOrder(false)
    setIsAllOrders(false)
    setActiveTab('profile')
  }

  // CLicking on My Orders
  const handleOrder = () => {
    setIsUpload(false)
    setIsProfile(false)
    setIsYourOrder(true)
    setIsAllOrders(false)
    setActiveTab('orders')
  }

  // Uploadimh New dish CLcik
  const handleUpload = () => {
    setIsUpload(true)
    setIsProfile(false)
    setIsYourOrder(false)
    setIsAllOrders(false)
    setActiveTab('addItem')
  }

  // SHwoing all orders
  const handleAllOrders = () => {
    setIsUpload(false)
    setIsProfile(false)
    setIsYourOrder(false)
    setIsAllOrders(true)
    setActiveTab('allOrders')
  }
  return (
    <div>
      <ToastContainer />
      <div className='flex justify-center gap-[2rem] m-12 flex-wrap'>
    <button className={`userButton ${activeTab === 'profile' ? 'activeButton' : 'inactiveButton'}`} onClick={handleProfile}>Profile</button>
    <button className={`userButton ${activeTab === 'orders' ? 'activeButton' : 'inactiveButton'}`} onClick={handleOrder}>Your Orders</button>
    {isAdmin && <button className={`userButton ${activeTab === 'addItem' ? 'activeButton' : 'inactiveButton'}`} onClick={handleUpload}>Add Item</button>}
    {isAdmin && <button className={`userButton ${activeTab === 'allOrders' ? 'activeButton' : 'inactiveButton'}`} onClick={handleAllOrders}>All Orders</button>}
</div>

      {isProfile && <Profile displayToast={displayToast} />}
      {isUpload && <UploadItem />}
      {isYourOrder && <YourOrder />}
      {isAllOrders && <AllOrders />}
    </div>
  )
}

export default ProfilePage
