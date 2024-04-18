import React, { useRef, useState, CSSProperties } from 'react'
import { useSelector } from 'react-redux'
import { RingLoader } from 'react-spinners';
import { displayToast, isAccessTokenExpired } from 'util';
import './index.css'

function UploadItem() {

    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState(null)
    const [buffetItems, setBuffetItems] = useState('')
    const baseUrl = process.env.REACT_APP_SERVER_URL
    const fileInputRef = useRef(null)
    const [loading, setLoading] = useState(false)

    // Accessing from the store
    const accessToken = useSelector(state => state.token)

    // Handle image file  select 
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            setImageUrl(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    // Reset Form
    const resetForm = () => {
        setName('')
        setQuantity(0)
        setPrice('')
        setImageUrl(null)
        setBuffetItems('')
    }


    // Loader properties overriding     
    const override: CSSProperties = {
        left: '50%',
        top: '30%',
        position: 'absolute'
    }
    // Handling the Submit button of Upload Item
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        document.body.classList.add('disable-scroll')
        const formdata = new FormData(e.target)

        try {
            if (isAccessTokenExpired(accessToken)) {
                const refreshTokenRes = await fetch(`${baseUrl}/refresh`, {
                    method: 'GET',
                    credentials: 'include', // Include cookies in the request
                })
                await refreshTokenRes.json()

            }

            let url = ''
            let makeReq = true
            if (formdata.get('type') === 'MenuItem') {
                url = `${baseUrl}/menu/addMenuItem`
                if (formdata.get('buffetItems') && formdata.get('buffetItems').trim() !== '') {
                    displayToast("Menu Item dont have buffet itmes", 3)
                    makeReq = false
                }
            }
            else if (formdata.get('type') === 'Buffet') {
                url = `${baseUrl}/buffet/addBuffet`
                if ((formdata.get('buffetItems') == null) || (formdata.get('buffetItems') && formdata.get('buffetItems').trim() === '')) {
                    displayToast("Please enter Buffet Items", 3)
                    makeReq = false
                }

            }
            else {
                url = `${baseUrl}/extra/addExtra`
                if (formdata.get('buffetItems') && formdata.get('buffetItems').trim() !== '') {
                    displayToast("Extra dont have buffet itmes", 3)
                    makeReq = false
                }
            }
            if (makeReq) {
                const uploadRes = await fetch(url, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${accessToken}` },
                    body: formdata
                })
                if (uploadRes.ok) {
                    displayToast("New Item added", 1)
                }
                resetForm()
            }
            setLoading(false)
            document.body.classList.remove('disable-scroll')

        } catch (error) {
            setLoading(false)
            document.body.classList.remove('disable-scroll')
            console.log(error)
        }

    }
    return (
        <div>
            <form onSubmit={handleSubmit} className='mt-8'>
                <div className='flex flex-col sm:flex-row gap-16 justify-center items-center sm:items-start'>
                    <div>
                        <div className='bg-red-500 w-[8rem] h-[10rem] rounded-lg'>{imageUrl && <img src={imageUrl} className='w-[8rem] h-[10rem]' alt='uploaditem' />}
                        </div>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                            required
                        />
                        <div className='userButton mt-4' onClick={() => fileInputRef.current.click()}
                            style={{ cursor: 'pointer' }}>Upload Image</div>
                    </div>

                    <div>
                        <RingLoader color='red' loading={loading} cssOverride={override} />
                        <div className="max-w-sm mx-auto p-4 bg-gray-100 rounded-md shadow-lg xxs:w-[40rem]">
                            <div className="flex">
                                <h2 className="text-2xl font-semibold mb-4 ml-4 text-black">Upload New Item</h2>
                            </div>
                            <div>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name='name'
                                        className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
                                        placeholder="Enter Item Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                                    <input
                                        id="quantity"
                                        name="quantity"
                                        className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
                                        type='number'
                                        placeholder="Enter minimum quantity"
                                        value={quantity}
                                        min='0'
                                        onChange={(e) => setQuantity(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                                    <input
                                        id="price"
                                        name='price'
                                        className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
                                        type='text'
                                        placeholder="Enter the price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='mb-4'>
                                    <label className='mr-2' htmlFor='type'>MenuItem</label>
                                    <input className='mr-4' type='radio' name='type' value='MenuItem' />
                                    <label className='mr-2' htmlFor='type'>Buffet</label>
                                    <input className='mr-4' type='radio' name='type' value='Buffet' />
                                    <label className='mr-2' htmlFor='type'>Extra</label>
                                    <input type='radio' name='type' value='Extra' />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="buffetItems" className="block text-sm font-medium text-gray-700">Buffet Items</label>
                                    <input
                                        id="buffetItems"
                                        name='buffetItems'
                                        className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
                                        type='text'
                                        placeholder="Enter Buffet Items "
                                        value={buffetItems}
                                        onChange={(e) => setBuffetItems(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default UploadItem
