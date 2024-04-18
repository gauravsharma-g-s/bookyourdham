import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { displayToast } from 'util'
import { setCart, setExtras, setMenu } from 'state'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AOS from 'aos'
import "aos/dist/aos.css";


function MenuPage() {
  const [menuItems, setMenuItem] = useState([])
  const [extraItems, setExtraItem] = useState([])
  const [isCustom, setIsCustom] = useState(true)
  const [quantityC, setQuantityC] = useState(0)
  const [addToCartInd, setAddToCartInd] = useState(null)

  /* Data From Store */
  const token = useSelector(state => state.token)
  const menuDishes = useSelector(state => state.menuDishes)
  const user = useSelector(state => state.user)
  const extras = useSelector(state => state.extras)
  const dispatch = useDispatch()


  /*  Url for making api calls   */
  const baseUrl = process.env.REACT_APP_SERVER_URL
  const cloudinaryUrl = process.env.REACT_APP_CLOUDINARY

  // Quantity Changes for each Dish
  const handleQuantityChange = (e, itemId, basePrice, type) => {
    let quantity = e.target.value
    let price = quantity * basePrice
    if (type === 'menu')
      setMenuItem((prevMenuItems) => prevMenuItems.map(menuItem => menuItem._id === itemId ? { ...menuItem, price: price } : menuItem))
    else
      setExtraItem((prevExtraItems) => prevExtraItems.map(extraItem => extraItem._id === itemId ? { ...extraItem, price: price } : extraItem))

  }

  // Custom or same selection
  const handleCustomSelect = (e) => {
    if (e.target.id === 'custom' || e.target.value === 'Custom per dish')
      setIsCustom(true)
    else
      setIsCustom(false)
    // setMenuItem(menuDishes)

  }

  // handle Quantity Same
  const handleSameQuantity = (e) => {
    setQuantityC(e.target.value)
    let quantity = e.target.value

    setMenuItem((prevMenuItems) => prevMenuItems.map(menuItem => {
      let price = quantity * menuItem.basePrice
      return ({ ...menuItem, price: price })
    }))
  }

  // Get All menuItems
  const getMenuItems = async () => {
    try {
      const menuItemResponse = await fetch(`${baseUrl}/menu/getAllMenuItems`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const menuItemsResp = await menuItemResponse.json()
      dispatch(setMenu({ menuDishes: menuItemsResp }))
    }
    catch (err) {
      displayToast("Internal Server error", 3)
    }
  }


  // Get all Plates {Extras}
  const getAllExtras = async () => {
    try {
      const extraItemsResp = await fetch(`${baseUrl}/extra/getAllExtras`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      const extraItemsRes = await extraItemsResp.json()
      dispatch(setExtras({ extras: extraItemsRes }))
    } catch (error) {
      displayToast("Internal Server error", 3)
    }
  }


  /// Handle Item add to Cart
  const handleItemAdd = async (menuItem, id, price, quantity, name, picturePath, basePrice, itemType, index) => {
    try {
      if (isNaN(quantity)) {
        displayToast(`Please enter number of persons ${menuItem.quantity}`, 3)
        return;
      }
      if (quantity < menuItem.quantity) {
        displayToast(`Minimum person should be ${menuItem.quantity}`, 3)
        return;
      }
      const itemAddRse = await fetch(`${baseUrl}/cart/addToCart`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user._id, itemId: id, count: quantity, price, name, picturePath, basePrice, itemType, quantity: 0, minquantity: menuItem.quantity })
      })
      const itemResponseJson = await itemAddRse.json()           // message: success
      dispatch(setCart({ cart: itemResponseJson.cart }))
      setAddToCartInd(index);

      // Reset the state after a delay to allow for animation
      setTimeout(() => {
        setAddToCartInd(null);
      }, 1000); // Adjust the delay as needed for your animation duration
    } catch (error) {
      displayToast("Some error occured", 3)
    }

  }

  useEffect(() => {
    getMenuItems()
      getAllExtras()
    window.scrollTo(0, 0)
    AOS.init();
    AOS.refresh();  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])          


  // Get Menu Items and Extra Items
  useEffect(() => {
    setMenuItem(menuDishes)
    setExtraItem(extras)
  }, [menuDishes, extras])
  return (
    <div>
      <ToastContainer />
      <div className='wrapper mx-4 sm:mx-24'>
        <h1 className='text-[1.7rem] sm:text-3xl font-bold text-red-500 text-center mt-16'>❤️ Make your own Package ❤️</h1>

        <h1 className='text-3xl font-bold text-red-500 text-center mt-16'>All Dishes</h1>
        <h3 className='text-xl font-semibold text-center mt-6 mb-8'>Select Dishes and Number of Persons</h3>
        <div className="hidden sm:block">
          <div className='flex justify-center mb-8 flex-wrap'>
            <label for="quantity">Persons</label><nbsp />
            &emsp;
            <input type='radio'
              id='custom'
              name='quantity'
              checked={isCustom}
              onChange={handleCustomSelect}
            /> &nbsp;
            <label for='quantity'>Custom for each Dish</label>
            &emsp;
            <input type='radio'
              id='same'
              name='quantity'
              checked={!isCustom}
              onChange={handleCustomSelect}
            />&nbsp;
            <label for='same'>Same for each dish</label>
            &emsp;&emsp;
            <input style={{ border: '1px solid #504d4d' }}
              className='sm:w-[6rem] xl:w-[12rem]'
              placeholder='20'
              type='number'
              disabled={isCustom}
              onChange={handleSameQuantity}
              min='20'
            />
          </div>
        </div>
        <div className=''>
          <div className="flex sm:hidden flex-wrap justify-center mb-[1.5rem]">
            <label for="quantity">Persons</label><nbsp />&emsp;
            <select value={isCustom ? 'Custom per dish' : 'Same per dish'} onChange={handleCustomSelect}>
              <option>Custom per dish</option>
              <option>Same per dish</option>
            </select>&emsp;
            <input style={{ border: '1px solid #504d4d', width: '4rem' }}
              placeholder='20'
              type='number'
              min='20'
              disabled={isCustom}
              onChange={handleSameQuantity}
            />
          </div>
        </div>

        {/* All Dishes Available */}
        <div className='flex justify-center sm:gap-5 lg:gap-8 flex-wrap'>
          {menuItems?.map((menuItem, i) => (
            <div key={menuItem._id} className='rounded border-4 mb-[1.2rem] sm:mb-0' data-aos="zoom-in">
              <div className='w-[18rem] p-4'>
                <img src={`${cloudinaryUrl}/${menuItem?.picturePath}`} style={{ width: '18rem', height: '14rem', objectFit: 'cover' }} alt='menuitem'/>
              </div>
              <div className='p-4'>
                <div className='flex justify-between mb-4'>
                  <h1 className='text-xl font-bold text-red-500'>{menuItem.name}</h1>
                  <input type='number'
                    id={menuItem._id}
                    key={menuItem._id}
                    min={menuItem.quantity}
                    placeholder='Persons'
                    onChange={(e) => handleQuantityChange(e, menuItem._id, menuItem.basePrice, 'menu')}
                    style={{ width: '80px', border: '1px solid black' }}
                    disabled={!isCustom}
                    value={!isCustom ? quantityC : undefined}
                  />
                </div>

                <div className='flex justify-between'>
                  <span className='rounded-full text-xl xl:text-2xl py-3 sm:py-1 xl:py-2 pr-6 sm:pr-4 xl:pr-5 font-semibold text-slate-700 '>
                    &#x20b9; {menuItem.price}
                  </span>
                  <button className={`rounded px-2 sm:py-2 text-sm ${addToCartInd === i ? 'bg-green-400 px-6 text-black border-[3px] border-solid border-green-700 ' : 'bg-green-700 text-white'}`} onClick={(e) => {
                    const quantityInput = document.getElementById(`${menuItem._id}`);
                    const quantity = quantityInput ? parseInt(quantityInput.value) : 0;
                    handleItemAdd(menuItem, menuItem?._id, menuItem?.price, quantity, menuItem?.name, menuItem?.picturePath, menuItem?.basePrice, "menu", i)
                  }
                  }> {`${addToCartInd === i ? 'Added' : 'Add to Cart'}`}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
        </div>

        {/* Plates Selection */}
        <h1 className='text-3xl font-bold text-red-500 text-center mt-16 mb-8'>Plates and Glasses</h1>
        <div className="flex justify-center sm:gap-5 lg:gap-8 flex-wrap">
          {extraItems?.map((extraItem, i) => (
            <div key={extraItem._id} className='rounded border-4 mb-[1.2rem] sm:mb-0' data-aos="zoom-in">
              <div className='w-[18rem] p-4'>
                <img src={`${cloudinaryUrl}/${extraItem.picturePath}`} style={{ width: '18rem', height: '14rem', objectFit: 'cover' }} alt='extraitem'/>
              </div>
              <div className='p-4'>
                <div className='flex justify-between mb-4'>
                  <h1 className='text-xl font-bold text-red-500'>{extraItem.name}</h1>
                  <input type='number'
                    id={extraItem._id}
                    key={extraItem._id}
                    min={extraItem.quantity}
                    placeholder='Persons'
                    onChange={(e) => handleQuantityChange(e, extraItem._id, extraItem.basePrice, 'extra')}
                    style={{ width: '80px', border: '1px solid black' }}
                    disabled={!isCustom}
                    value={!isCustom ? quantityC : undefined}
                  />
                </div>

                <div className='flex justify-between'>
                  <span className='rounded-full text-xl font-semibold xl:text-2xl py-3 sm:py-1 xl:py-2 pr-6 sm:pr-4 xl:pr-5 text-slate-700 '>
                    &#x20b9; {extraItem.price}
                  </span>
                  <button className={` rounded px-2 sm:py-2 text-sm ${addToCartInd === i ? 'bg-green-400 px-6 text-black border-[3px] border-solid border-green-700 ' : 'bg-green-700 text-white'}`} onClick={() => {
                    const quantityInput = document.getElementById(`${extraItem._id}`);
                    const quantity = quantityInput ? parseInt(quantityInput.value) : 0;
                    handleItemAdd(extraItem, extraItem?._id, extraItem?.price, quantity, extraItem.name, extraItem.picturePath, extraItem.basePrice, "extra", i)

                  }}> {`${addToCartInd === i ? 'Added' : 'Add to Cart'}`}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MenuPage
