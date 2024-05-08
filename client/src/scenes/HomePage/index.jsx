import './index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCalendarDay, faCreditCard, faLocationDot, faUtensils } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState, CSSProperties } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { displayToast } from 'util'
import { setBuffets, setCart } from 'state'
import { useNavigate } from 'react-router-dom'
import AOS from "aos";
import "aos/dist/aos.css";
import { RingLoader } from 'react-spinners'

function HomePage() {
  const [addToCartInd, setAddToCartInd] = useState(null)
  const [loading, setLoading] = useState(false)

  // Order steps
  const steps = [{ number: 1, icon: faUtensils, text: 'Select your dishes from our diverse menu for your event.' },
  { number: 2, icon: faCalendarDay, text: 'Pick the date and time for your delivery' },
  { number: 3, icon: faLocationDot, text: 'Provide your delivery address for prompt service.' },
  { number: 4, icon: faCreditCard, text: `Pay online or opt for cash on delivery. Relax, we'll ensure timely delivery!` }]

  // testimonials
  const test = [{ number: 1, name: 'Sourav Rana', link: 'https://images.pexels.com/photos/938639/pexels-photo-938639.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', text: 'BookYourDham made catering for my event a breeze! From selecting dishes to specifying delivery details, the process was seamless. The food arrived right on time, and the quality was exceptional. Highly recommend!', location: 'Bilaspur' },
  { number: 2, name: 'Pankaj Sharma', link: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', text: `I used BookYourDham for my wedding, and it was amazing! It made menu customization a breeze, and the delivery was prompt. Guests adored the tasty food, and experience was stress-free. Thank you, BookYourDham!`, location: 'Ghumarwin' },
  { number: 3, name: 'Dipti Thakur', link: 'https://img.freepik.com/free-photo/female-model-with-white-t-shirt-posing_114579-14031.jpg?w=360&t=st=1712928151~exp=1712928751~hmac=45895274c8eaa59d6f0eaef299b501f206c92015728f46e7750521536585e76c', text: `BookYourDham exceeded my birthday party catering expectations! Extensive menu, easy ordering, hot, fresh food, and courteous and professional delivery team. Will use again for future events!`, location: 'Hamirpur' }]
  const [buffets, setBuffet] = useState([])

  /*  Url for making api calls   */
  const baseUrl = process.env.REACT_APP_SERVER_URL
  const cloudinaryUrl = process.env.REACT_APP_CLOUDINARY

  /* Data From Store */ 

  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')
  const allBuffets = useSelector(state => state.buffets)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Get all Buffets
  const getAllBuffets = async () => {
    try {
      setLoading(true)
      document.body.style.overflow = "hidden"
      const buffetRes = await fetch(`${baseUrl}/buffet/getAllBuffets`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      setLoading(false)
      const buffetResponse = await buffetRes.json()
      dispatch(setBuffets({ buffets: buffetResponse }))
      document.body.style.overflow = "auto"
    } catch (error) {
      displayToast("Internal Server error", 3)
      document.body.style.overflow = "auto"
    }
  }

  // Scroll to How to Order
  function scrollToHowToOrder() {
    const element = document.getElementById('howToOrder')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Handle Item Add to Cart
  const handleItemAdd = async (buffet, index) => {
    try {
      const itemAddRse = await fetch(`${baseUrl}/cart/addToCart`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemType: 'buffet', userId: user._id, itemId: buffet._id, count: 1, price: buffet.price, name: buffet.name, picturePath: buffet.picturePath, basePrice: buffet.price, quantity: buffet.quantity, minquantity: 1 })
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




  // Loader properties overriding     
  const override: CSSProperties = {
    left: '50%',
    top: '40%',
    position: 'absolute'
  }
  // Get all Buffets on initial render
  useEffect(() => {
    if (!allBuffets)
      getAllBuffets()
    window.scrollTo(0, 0)
    AOS.init()
    AOS.refresh()            // eslint-disable-next-line
  }, [])

  useEffect(() => {
    setBuffet(allBuffets)
  }, [allBuffets])         // eslint-disable-next-line

  return (
    <div>
      <div
        style={{
          position: 'absolute',
          zIndex: 4,
          height: "50vh", // Makes the container take the full height of the viewport
          width: "100%"
        }}
      >
        <RingLoader loading={loading} color="red" cssOverride={override} />
      </div>
      {/* Desktop or Big Screen View */}
      <div className='hidden sm:block'>

        <div className='flex lg:mx-28 md:mx-16 sm:mx-8 justify-between'>
          <div className='left w-[50%] mt-[2rem] xl:mt-[2rem] 2xl:mt-18 3xl:mt-[10rem]'>
            <span className='text-2xl lg:text-4xl xl:text-5xl 2xl:text-7xl 3xl:text-8xl font-bold lg:leading-[3rem] xl:leading-[4rem] 2xl:leading-[6rem] 3xl:leading-[8rem]'>Be it a small affair or a grand affair, <span className='text-red-500'>bookyourdham</span> takes care of your food affair</span>
            <h3 className='text-sm lg:text-2xl 3xl:text-4xl text-slate-500 mt-4 xl:mt-8 3xl:mt-[3rem]'>From intimate gatherings to weddings in full sway, 'Book Your Dham' ensures your food's just a click away</h3>
            <div className='flex justify-between mt-8 xl:mt-16 2xl:me-16 3xl:mt-[5rem]'>
              <button className="rounded-full bg-red-500 text-white px-3 lg:px-5 xl:px-10 py-2 lg:py-3 3xl:py-6 text-[0.8rem] lg:text-[1.3rem]"
                onClick={() => { navigate('/menu'); navigate(0) }}
              >Book your Order
                <span className="ps-4 icon">
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </button>
              <button className="rounded-full bg-zinc-300 px-3 lg:px-5 xl:px-10 py-2 lg:py-3 text-[0.8rem] lg:text-xl" onClick={scrollToHowToOrder}>How to Order
                <span className="ps-4 pt-[2rem]">
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </button>
            </div>
          </div>
          <div className='right w-[40%] mt-[2rem] md:mt-[0.5rem] lg:mt-[2rem] xl:mt-[2.2rem] 2xl:mt-[4rem] 3xl:mt-[8rem] '>
            <div>
              <img src='./assets/pan.png' alt='hero' />
            </div>
          </div>
        </div>
      </div>


      {/* Small Screens View */}
      <div className='blocked sm:hidden'>
        <div className='m-[3rem]'>
          <span className='text-4xl font-bold leading-snug'>Be it a small affair or a grand affair, <span className='text-red-500'>bookyourdham</span> takes care of your food affair</span>
          <h3 className='text-base text-slate-500 mt-4'>From intimate gatherings to weddings in full sway, 'Book Your Dham' ensures your food's just a click away</h3>
          <div className='flex justify-between mt-8'>
            <button className="rounded-full bg-red-500 text-white px-3 py-2 text-[0.8rem]" onClick={() => { navigate('/menu'); navigate(0) }}>Book your Order
              <span className="ps-4 ">
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </button>
            <button className="rounded-full bg-zinc-300 px-3 py-2 text-[0.8rem]" onClick={scrollToHowToOrder}>How to Order
              <span className="ps-4 pt-[2rem]">
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </button>
          </div>
          <div className='mt-[2rem]'>
            <div>
              <img src='./assets/pan.png' alt='hero' />
            </div>
          </div>
        </div>
      </div>

      {/* Trending Packs */}
      <div className='mt-24 py-8 bg-[#deb887]'>
        <div className='text-center'>
          <h1 className='text-5xl font-bold text-red-500'>Trending Packs</h1><br />
          <h3 className='text-lg text-slate-500'>Ideal for small Functions or Parties</h3><br />
        </div>
        <div className='flex justify-center sm:gap-5 lg:gap-8 flex-wrap'>

          {
            buffets?.map((buffet, index) => (
              <div className='w-[310px] h-[450px] rounded border-4 mb-[1.2rem] sm:mb-0 relative shadow-xl shadow-[#5c5b5b] ' key={buffet._id} data-aos="zoom-in" >
                <div className='p-4'>
                  <img className='' src={`${cloudinaryUrl}/${buffet?.picturePath}`} style={{ width: '18rem', height: '14rem', objectFit: 'cover' }} alt='' />
                </div>
                <div className='flex justify-between mx-2'>
                  <div className='font-bold text-xl'>
                    {buffet.name}
                  </div>
                  <p className='text-md'>{buffet.quantity} persons</p>
                </div>

                <div className='px-2 mt-4 mb-8 flex flex-wrap gap-2'>
                  {
                    buffet?.dishes?.map(dish =>
                      <span className='bg-white rounded-lg px-2 mx-1 text-sm'>{dish}</span>
                    )
                  }
                </div>
                <div className='px-4 absolute bottom-2' style={{ width: '-webkit-fill-available' }}>
                  <div className='flex justify-between'>
                    <span className='rounded-full  text-xl font-bold py-3 sm:py-1 xl:py-2 px-6 sm:px-4 xl:px-5 font-bold text-slate-700'>
                      &#x20b9; {buffet.price}
                    </span>
                    <button className={` rounded px-2 sm:py-2 text-sm ${addToCartInd === index ? 'bg-green-400 px-6 text-black border border-solid border-green-700 ' : 'bg-green-700 text-white'}`} onClick={() => handleItemAdd(buffet, index)}> {`${addToCartInd === index ? 'Added' : 'Add to Cart'}`}</button>
                  </div>

                </div>
              </div>

            ))
          }
        </div>
      </div>


      {/* How to Order */}
      <div className='my-[3rem] py-[2rem]' id='howToOrder'>
        <h1 className='text-5xl font-bold text-red-500 text-center'>How to Order</h1>
        <ol className='mt-16'>
          {
            steps.map(step => (
              <li key={step.number}>
                <div className='icon'>
                  <FontAwesomeIcon icon={step.icon} />
                </div>
                <div className='title'>
                  Step {step.number}
                </div>
                <div className='desc'>
                  {step.text}
                </div>
              </li>
            ))
          }
        </ol>
      </div>


      {/* Testimonials */}
      <div className='bg-red-300 pb-24 mt-16 '>
        <div className='flex flex-col justify-center items-center lg:mx-28 md:mx-16 sm:mx-8 '>
          <h1 className='text-5xl font-bold text-red-500 text-center mt-16'>😊 What our Customers Say 😊 </h1>
          <div className='cards mt-[10rem]'>
            {
              test.map(test => (
                <div className='card' key={test.number}>
                  <img className='object-cover' src={test.link} alt='testimonial' />
                  <p>{test.text}</p>
                  <h2 className='text-2xl font-medium mb-[4px] mt-4'>{test.name}</h2>
                  <h4 className='text-[16px] font-normal'>{test.location}</h4>
                </div>
              ))
            }
          </div>
        </div>
      </div>



    </div>
  )
}

export default HomePage
