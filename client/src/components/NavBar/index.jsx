import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import LoginForm from 'components/LoginForm/index.jsx'
import './index.css'
import { faBars, faCartShopping, faUser, faRightFromBracket, faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch, useSelector } from 'react-redux'
import { setLogout } from 'state'
import BottomNavComponent from './BottomNavComponent'

function NavBar() {

  const cloudinaryUrl = process.env.REACT_APP_CLOUDINARY
  const [active, setActive] = useState(0)         // Check which button is active on bottom Navigation
  const [showForm, setShowForm] = useState(false);

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.user)

  const handleLogout = () => {
    dispatch(setLogout())
    navigate('/')
  }

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden' // Disable scrolling when overlay is active
    } else {
      document.body.style.overflow = 'auto' // Enable scrolling when overlay is inactive
    }

    return () => {
      document.body.style.overflow = 'auto' // Ensure scrolling is enabled when component unmounts
    };
  }, [showForm])


  // User press back Button on Small Screens
  const location = useLocation()
  useEffect(() => {
    // Extract pathname from location
    const { pathname } = location;

    // Set active item based on pathname
    if (pathname === '/') {
      setActive(0)
    } else if (pathname === '/menu') {
      setActive(1);
    } else if (pathname === '/cart') {
      setActive(2);
    }
    else if (pathname === '/profile') {
      setActive(3)
    }
  }, [location]);

  return (
    // Big screens navigation menu
    <header className='sticky top-0' style={{ zIndex: '100' }}>
      <div className='hidden sm:block bg-white w-full shadow-lg'>
        <nav className='flex lg:mx-28 md:mx-16 sm:mx-8 my-4 justify-between lg:pb-4'>
          <h1 className='text-red-500 italic font-bold text-2xl w-[50%] pt-2 uppercase' style={{'cursor':'pointer'}} onClick={()=>{navigate('/');navigate(0)}}>bookyourdham</h1>
          <div className='flex justify-between  gap-16 w-[50%] pt-2 mr-4'>
            <div className='flex gap-16 sm:gap-4 md:gap-8 lg:gap-[3rem] xl:gap-24 2xl:gap-[9rem] text-xl  text-gray-500 font-semibold w-[30%]'>
              <Link to='/' className={`${active === 0 ? 'text-red-500' : ''} nav`}>Home</Link>
              <Link to='/menu' className={`${active === 1 ? 'text-red-500' : ''} nav`}>Menu</Link>
              <Link className='nav'>Contact</Link>
            </div>
            <div className={`flex justify-between gap-4 text-lg w-[20%]`}>
              {!user && <Link className='text-red-500' onClick={() => setShowForm(true)}>Sign In</Link>}
              {user && <Link className={`text-white bg-red-500  text-center lg:rounded-full object-cover overflow-hidden w-[26px] h-[26px]
              rounded-lg lg:w-10 lg:h-10 border-2 ${active === 3 ? 'border-red-500' : 'border-gray-500'}`}>
                {user.picturePath === "" ?
                  <div className='bg-red-500 rounded-full object-cover overflow-hidden rounded-md w-[24px] h-[24px]
                 lg:w-10 lg:h-10 lg:text-[1.5rem]' onClick={() => { navigate('/profile'); navigate(0) }}>{user?.name[0]}</div> :
                  <img src={`${cloudinaryUrl}/${user?.picturePath}`} alt={`${user?.name[0]}`} onClick={() => { navigate('/profile'); navigate(0) }} />
                } </Link>}
              <Link className={active === 2 && `text-red-500`} onClick={() => {
                if (user) {
                  navigate('/cart');
                  navigate(0)
                }
                else {
                  setShowForm(true)
                }
              }
              } ><FontAwesomeIcon icon={faCartShopping} /></Link>
            </div>
          </div>
          {user && <button className='absolute right-1 top-1.5 lg:right-3' onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>}
        </nav>
      </div>

      {/* Small screens Navigation menu*/}
      <div className='sm:hidden bg-white w-full z-5 shadow-lg'>
        <nav className='flex lg:mx-24 md:mx-16 sm:mx-8 my-4 justify-around'>
          <h1 className='text-red-500 italic font-bold text-2xl w-[50%] pt-2 mx-4 mb-2 text-center uppercase'>bookyourdham</h1>
          {user && <button className='absolute right-4 top-1.5' onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>}
        </nav>
      </div>

      {/* Bottom Navigation*/}
      <div className='block sm:hidden fixed bottom-0  w-full z-20'>
        <nav className='max-h-[4.4rem] px-6 rounded-t-xl z-4 bg-red-500'>
          <div className='flex relative justify-evenly'>
            <BottomNavComponent name={"Home"} icon={faHome} setShowForm={setShowForm} active={active} setActive={setActive} i={0} />
            <BottomNavComponent name={"Menu"} icon={faBars} setShowForm={setShowForm} active={active} setActive={setActive} i={1} />
            <BottomNavComponent name={"Cart"} icon={faCartShopping} setShowForm={setShowForm} active={active} setActive={setActive} i={2} />
            <BottomNavComponent name={"Profile"} icon={faUser} setShowForm={setShowForm} active={active} setActive={setActive} i={3} />
          </div>
        </nav>
      </div>

      {/* Show the Signup Form on SignIn Button */}

      {showForm && <div className='overlay'> <LoginForm setShowForm={setShowForm} /> </div>}

    </header>
  )
}

export default NavBar
