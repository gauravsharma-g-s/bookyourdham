import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { editCart, setCart } from 'state'
import { displayToast } from 'util'


function CartItems({ currentStep, setCartItems, setCartEmpty }) {
  const baseUrl = process.env.REACT_APP_SERVER_URL;
  const cloudinaryUrl = process.env.REACT_APP_CLOUDINARY;
  const [editedItems, setEditedItems] = useState({});
  const user = useSelector(state => state.user);
  const token = useSelector(state => state.token);
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();;

  // Qauntity Changes of items in Cart
  const handleQuantityChange = (e, itemId, basePrice) => {
    const quantity = e.target.value;
    const price = quantity * basePrice;
    setEditedItems(prevState => ({
      ...prevState,
      [itemId]: { count: quantity, price }
    }));
  }

  // Save the quantity changes
  const handleSaveChanges = async (cartItem, itemId) => {
    try {
      const editedItem = editedItems[itemId]
      if (editedItem.count < cartItem.minquantity) {
       
        displayToast("Increase number of persons", 3)
        return
      }
      if (editedItem) {
        // Dispatch the action to update the cart item
        dispatch(editCart({
          itemId,
          updatedData: {
            count: editedItem.count,
            price: editedItem.price
          }
        }))

        // Save item to server
        await saveItemToServer(itemId, editedItem);
        setCartItems(cart?.items)

        setEditedItems(prevState => {
          const newState = { ...prevState };
          delete newState[itemId];
          return newState;
        })
      }
    } catch (error) {
      console.log(error);
    }

  }

  // Save quantity Chnages to Server
  const saveItemToServer = async (itemId, editedItem) => {
    const cartItem = cart.items.find(item => item.itemId === itemId);
    if (cartItem) {
      await fetch(`${baseUrl}/cart/changeCount`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          count: editedItem.count,
          userId: user._id,
          itemId: itemId,
          price: editedItem.price
        })
      });
    }
  }

  // Delete item from Cart
  const handleDelete = async (itemId) => {
    const deleteRes = await fetch(`${baseUrl}/cart/deleteItem`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ itemId, userId: user._id })
    })

    const deleteResJson = await deleteRes.json()
    dispatch(setCart({ cart: deleteResJson.cart }))
    setCartEmpty((prevlength) => prevlength - 1)
  }
  return (
    <div className='xxs:w-[80%] sm:w-[42%] md:w-[45%] min-h-screen'>
      <ToastContainer />
      <div className='flex flex-col gap-4'>
        {cart?.items?.map((cartItem) => (
          <div>
            <div className="flex items-center py-4 " key={cartItem._id}>
            <div className="flex-shrink-0 w-[3.5rem] h-[3.5rem] sm:w-[3rem] h-[3rem] md:w-[3.5rem] md:h-[3.5rem] bg-gray-200 rounded-md overflow-hidden">
              <img src={`${cloudinaryUrl}/${cartItem?.picturePath}`} alt='' className="w-full h-full object-cover" />
            </div>
            <div className="mx-4 sm:mx-4 md:mx-8 w-[3rem]">
              <h3 className="md:text-md font-bold">{cartItem?.name}</h3>
              <h3 className="text-xs italic text-green-700" style={{ fontWeight: '500', color: '#696565', fontSize: 'x-small' }}> {cartItem.itemType === 'buffet' ? cartItem.count * cartItem.quantity : cartItem.count} persons</h3>
            </div>
            <div className="flex items-center flex-row space-x-3 xxs:space-x-4 sm:space-x-3 md:space-x-4 md:mr-8 ml-2 mr-4 xxs:mx-4">
              <input
                type='number'
                id={cartItem._id}
                key={cartItem._id}
                min={cartItem.miniquantity}
                onChange={(e) => handleQuantityChange(e, cartItem.itemId, cartItem.basePrice)}
                style={{ width: '40px', border: '1px solid black' }}
                value={(editedItems[cartItem.itemId]?.count !== undefined) ? editedItems[cartItem.itemId].count : cartItem.count}
                disabled={currentStep === 0 ? false : true}
              />
            </div>
            <div className="text-gray-600 mb-2 w-[4rem]">&#x20b9; {(editedItems[cartItem.itemId]?.price !== undefined) ? editedItems[cartItem.itemId].price : cartItem.price}</div>
            {(editedItems[cartItem.itemId] !== undefined) && (
              <div className='flex flex-col gap-2 ml-2 lg:flex lg:flex-row'>
                <button className="bg-green-500 text-white px-2 py-1 " onClick={() => handleSaveChanges(cartItem, cartItem.itemId)}>Save</button>
                <button className="bg-red-500 text-white px-2 py-1" onClick={() => setEditedItems(prevState => {
                  const newState = { ...prevState }
                  delete newState[cartItem.itemId]
                  return newState;
                })}>Cancel</button>
              </div>
            )}
            <button className='ml-2 xxs:ml-6 sm:ml-4 2xl:ml-8' onClick={() => { handleDelete(cartItem.itemId) }} disabled={currentStep === 0 ? false : true}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
          <div className='h-[1px] bg-gray-200 w-[20rem]'></div>

          </div>
          
        ))}
      </div>
    </div>
  );
}

export default CartItems;
