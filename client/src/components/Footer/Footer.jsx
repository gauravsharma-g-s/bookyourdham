import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faInstagram, faLinkedinIn, faXTwitter } from '@fortawesome/free-brands-svg-icons'

function Footer() {
  return (
    <div className='bg-white text-red-600' style={{ overflowX: 'hidden', paddingTop: '3rem' }}>
      <div className="grid lg:mx-28 md:mx-16 sm:mx-8 mb-[2rem] gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 justify-center" rowspacing={0}>
        <div className='mt-[1rem] mx-[2rem] mb-[2rem] text-justify grid-cols-8 sm:grid-cols-10 md:grid-cols-6 lg:grid-cols-4'>
          <h1 className='text-3xl font-semibold pb-4'>bookyourdham</h1>
          <div className='text-slate-400'>Your go-to for event delights! Customize your order, sit back, and let us handle the flavor. With prompt service and mouthwatering dishes, your event is in good hands!
          </div>
        </div>

        <div className='mx-[2rem] mb-[2rem] pl-1 text-justify grid-cols-8 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-1'>
          <h3 className='headings'>Explore</h3>
          <ul style={{ listStyleType: 'none' }}>
            <li><Link to='/' className='link'>Home</Link></li>
            <li><Link to='/menu' className='link'>Menu</Link></li>

            <li><Link to='' className='link'>Help</Link></li>
            <li><Link to='/about' className='link'>About Us</Link></li>
          </ul>
        </div>

        <div className=' mx-[2rem] mb-[2rem] pl-0 text-justify grid-cols-8 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-1'>
          <h3 className='headings'>Other Products</h3>
          <ul style={{ listStyleType: 'none' }}>
            <li><a href='https://connect-cdgy.onrender.com/' className='link' target='_blank'>Connect</a></li>
            <li><a href='https://four04nomore.onrender.com/' className='link' target='_blank'>four04nomore</a></li>
          </ul>
          <h3 className='headings'>Contact Us</h3>
          <ul style={{ listStyleType: 'none' }}>
            <li><a href='mailto:bookyourdhamregistration@outlook.com' className='link'>contact@bookyourdham.com</a></li>
            <li><a href='tel:8219496857' className='link'>+91 8219496857</a></li>
          </ul>
        </div>

        <div className='mx-[2rem] mb-[2rem] pl-0 text-justify grid-cols-8 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-1'>
          <h3 className='headings'>Stay In Touch</h3>
          <ul style={{ listStyleType: 'none' }}>
            <li style={{ marginBottom: '1rem' }}><a href='https://www.facebook.com/people/Bookyourdham/61558387478400/' target='_blank' className='link'><FontAwesomeIcon icon={faFacebookF} /><span style={{ marginLeft: '0.4rem' }}>Facebook</span></a></li>
            <li style={{ marginBottom: '1rem' }}><a href='https://twitter.com/gauravsharma_g_?t=DvAfJs43POPqXHblQS88Ug&s=08' target='_blank' className='link'><FontAwesomeIcon icon={faXTwitter} /><span style={{ marginLeft: '0.4rem' }}>Twitter</span></a></li>
            <li style={{ marginBottom: '1rem' }}><a href='https://www.linkedin.com/in/gaurav-sharma-059576214/' target='_blank' className='link'><FontAwesomeIcon icon={faLinkedinIn} /><span style={{ marginLeft: '0.4rem' }}>Linkedin</span></a></li>
            <li style={{ marginBottom: '1rem' }}><a href='https://www.instagram.com/bookyourdham/' target='_blank' className='link'><FontAwesomeIcon icon={faInstagram} /><span style={{ marginLeft: '0.4rem' }}>Instagram</span></a></li>
          </ul>
        </div>


        <div className='mt-[0rem] mx-[2rem] mb-[2rem] pl-0 text-justify grid-cols-8 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-1'>
          <h3 className='headings'>Legal</h3>
          <ul style={{ listStyleType: 'none' }}>
            <li><Link to='/about' className='link'>Terms</Link></li>
            <li><Link to='/about' className='link'>Policies</Link></li>
            <li><Link to='/about' className='link'>Security</Link></li>
          </ul>
        </div>
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.8rem', marginBottom: '1rem' }}>
        Copyright © 2024 bookyourdham | All rights reserved | Made in India
      </div>
    </div>
  )
}

export default Footer
