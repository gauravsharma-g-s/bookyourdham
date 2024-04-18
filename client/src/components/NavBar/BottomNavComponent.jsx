import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux'

function BottomNavComponent({ name, icon, setShowForm, active, setActive, i }) {
  const user = useSelector(state => state.user) 
  const navigate = useNavigate() 

  return (
    <div>
      {/* Container for each navigation item */}
      <div className='w-16' onClick={() => {
        if (!user && name === 'Profile')
          return setShowForm(true) // Show form to login/register if user not logged in and Profile clicked
        else if (user && name === 'Profile') {
          navigate('/profile'); // Navigate to profile page if user is logged in and Profile clicked
          navigate(0) // Reset navigation state
        }
        else if (!user && name === 'Cart') {
          setShowForm(true) // Show form to login/register if user not logged in and Cart clicked
        }
        else if (user && name === 'Cart') {
          navigate('/cart') // Navigate to cart page if user is logged in and Cart clicked
          navigate(0) // Reset navigation state
        }
      }}>
        {/* Link for navigation item */}
        <Link to={name === 'Menu' ? '/menu' : name === 'Home' ? '/' : ''} className='flex flex-col text-center pt-6' onClick={() => setActive(i)}>
          {/* Icon */}
          <span className={`text-xl cursor-pointer duration-500 ${i === active && "-mt-6"} ${i === active && "text-white"}`}>
            <FontAwesomeIcon icon={icon} />
          </span>
          {/* Navigation item name */}
          <span className={`${active === i ? 'translate-y-4 duration-700 opacity-100' : 'opacity-0 translate-y-10'
            } ${i === active && "text-white"}`}>
            {name}
          </span>
        </Link >
      </div>
    </div>
  )
}

export default BottomNavComponent
